# Node WriteStream 可写流的实现原理

## 一、关于可写流
所有可写流都实现了 stream.Writable 类定义的接口，比如：
  1) 客户端的HTTP请求
  2) 服务器的HTTP响应
  3) fs的写入流
  4) zlib流
  5) 子进程的stdin

可写流的用法有如下特点：

1）可写流可以通过 write 写数据
```javascript
let fs = require('fs');
// 通过 createWriteStream 可以创建一个 WriteStream 的实例
let ws = fs.createWriteStream('./name.txt', {
  flags: 'w',
  highWaterMark: 2, // 定义缓冲区大小
  autoClose: true,
  start: 0, // 开始写入的位置
  mode: 0o666,
  encoding: 'utf8'
});
// 只能写 字符串、buffer
ws.write('1', 'utf8', () => {
  console.log('写入1成功')
});
```

2）可写流可以通过 end 写数据并关闭流，end() 相当于 write() + close() 
```javascript
// end = write + close
ws.end('结束', 'utf8', () => {
  console.log('写入"结束"成功')
})
```

3）当写入数据达到 highWaterMark 的大小时，会触发 drain 事件
```javascript
// 当正在写入数据 + 缓冲区数据长度超过 highWaterMark 的值时，会触发 drain 事件
ws.on('drain', function () {
  console.log('drain');
});
```


## 二、WriteStream 的用法

WriteStream 是可写流的一种，WriteStream 的用法如下： 
```javascript
let fs = require('fs');

// 通过 createWriteStream 可以创建一个 WriteStream 的实例
let ws = fs.createWriteStream('./name.txt', {
  flags: 'w',// 文件的打开模式
  highWaterMark: 2, // 定义缓冲区大小
  autoClose: true, // 是否自动关闭文档
  start: 0, // 写入文件的起始索引位置
  mode: 0o666, // 文件的权限设置
  encoding: 'utf8' // 写入文件的字符的编码
});

// 只能写 字符串、buffer
ws.write('1', 'utf8', () => {
  console.log('写入1成功')
});

// 由于第一次可能还没写入完成，因此，此次写的内容会被保存在 WriteStream 的链表缓冲区中
ws.write('2', 'utf8', () => {
  console.log('写入2成功')
})

// 此次写的内容会被保存在 WriteStream 的链表缓冲区中
ws.write('3', 'utf8', () => {
  console.log('写入3成功')
})

// end = write + close
ws.end('结束', 'utf8', () => {
  console.log('写入"结束"成功')
})

// 当正在写入数据 + 缓冲区数据长度超过 highWaterMark 的值时，会触发 drain 事件
ws.on('drain', function () {
  console.log('drain');
});
```


关键点分析：

1、通过 fs.createWriteStream 可以创建一个 WriteStream 实例，具体用法可以看以上注释


2、highWaterMark 用于设置 WriteStream 可写流缓冲区大小，默认为 16k，当正在写入数据 + 缓冲区数据长度超过 highWaterMark 的值时，会触发 drain 事件


3、可写流 write 和 end 方法只能写 字符换 或 buffer 类型的数据


4、并行写，顺序不会乱
```javascript
let fs = require('fs');
// 通过 createWriteStream 可以创建一个 WriteStream 的实例
let ws = fs.createWriteStream('./name.txt', {
  flags: 'w',// 文件的打开模式
  highWaterMark: 2, // 定义缓冲区大小
  autoClose: true, // 是否自动关闭文档
  start: 0, // 写入文件的起始索引位置
  mode: 0o666, // 文件的权限设置
  encoding: 'utf8' // 写入文件的字符的编码
});
for (let i = 0; i < 100; i++) {
  ws.write(i.toString(), 'utf8', () => {
    console.log(`写入${i}成功`)
  });
}
```


5、通过一个字节的缓冲区 highWaterMark = 1 ，写入一个10个数
```javascript
let fs = require('fs');
// 通过 createWriteStream 可以创建一个 WriteStream 的实例
let ws = fs.createWriteStream('./name.txt', {
  flags: 'w',// 文件的打开模式
  highWaterMark: 1, // 定义缓冲区大小
  autoClose: true, // 是否自动关闭文档
  start: 0, // 写入文件的起始索引位置
  mode: 0o666, // 文件的权限设置
  encoding: 'utf8' // 写入文件的字符的编码
});

let index = 0;

function write() {
  let flag = true;
  while (index < 10 && flag) {
    flag = ws.write(index++ + '', 'utf8', () => {
      console.log(`写入成功`)
    })
  }
}
write();

// 当正在写入数据 + 缓冲区数据长度超过 highWaterMark 的值时，会触发 drain 事件
ws.on('drain', function (params) {
  console.log('drain')
  write();
});
```


## 三、实现一个简单版的 WriteStream
代码如下：
```javascript
let EventEmitter = require('events');
let fs = require('fs');

/**
 * 可写流需要考虑并发写的问题，比如并发写时，要确保写的顺序不错乱。
 * 为了保证并发写顺序不会乱，WriteStream 创建了一个链表结构缓冲区，
 * 用来按顺序缓存待写的内容，等待当前正在写的内容写完，再依次从缓冲区中一个一个读取出来继续写。
 */
class Node {
  constructor(element) {
    this.element = element;
    this.next = null;
  }
}
class LinkList {
  constructor() {
    this.head = null;
    this.length = 0;
  }
  append(chunk) {
    let node = new Node(chunk);
    if (this.head == null) { // 链表的头
      this.head = node;
    } else {
      // 找到最后一个把当前节点 放到后面去
      let current = this.head;
      while (current.next) {
        current = current.next;
      }
      current.next = node;
    }
    this.length++
  }
  get() {
    let head = this.head;
    if (!head) return
    this.head = head.next;
    this.length--;
    return head.element
  }
}

module.exports = class WriteStream extends EventEmitter {
  constructor(path, options) {
    super();
    this.path = path;
    this.flags = options.flags || 'w';
    this.highWaterMark = options.highWaterMark || 16 * 1024;
    this.autoClose = options.autoClose || true;
    this.start = options.start || 0;
    this.mode = options.mode || 0o666;
    this.encoding = options.encoding || 'utf8';

    this._writing = false;// 表示当前是否正在写入
    this.cache = new LinkList(); // 缓冲区，如果当前正在写，就把待写入的内容放到缓冲区中
    // 只有当前消耗掉了和期望值相等或者大于期望值的时候 设置成true
    this.needDrain = false; // 当 缓存区的内容 + 正在写入的内容 超过 highWaterMark 时，设置为 true，代表需要出发 drain 事件
    this.pos = this.start; // 写入的位置的偏移量
    this.open(); // 打开文件准备写入 

    this.len = 0; // 用来统计 缓冲区 + 正在写入的内容的个数
  }

  // 只能写 字符串 或 buffer 类型的数据
  write(chunk, encoding = this.encoding, callback) {
    chunk = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    this.len += chunk.length;
    let flag = this.len < this.highWaterMark;
    this.needDrain = !flag // 当 len >= highWaterMark 时，设置 needDrain 为 true，需要触发 drain 事件

    if (this._writing) {
      // 当前正在写，将待写内容保存到缓冲区中
      this.cache.append({
        chunk,
        encoding,
        callback
      });
    } else {
      // 真正的写入逻辑
      this._writing = true;
      this._write(chunk, encoding, () => {
        callback && callback();
        this.clearBuffer(); // 从缓冲区中取出一个出来写
      });
    }
    return flag; // true: 没有超过 highWaterMark(可以继续写) || false: 超过 highWaterMark(不要继续写了)
  }

  clearBuffer() { // 依次从链表中取出一个出来写
    let obj = this.cache.get();
    if (obj) {
      this._write(obj.chunk, obj.encoding, () => {
        obj.callback && obj.callback();
        this.clearBuffer();
      })
    } else {// obj 为 undefined 说明缓冲区已经清空完毕
      this._writing = false; // 表示当前没有在写，下次再调用 write 可以直接向文件中写入
      if (this.needDrain) {
        // 当 needDrain 为 true 时，需要触发 drain 事件
        this.needDrain = false;
        this.emit('drain')
      }
    }
  }

  open() {
    fs.open(this.path, this.flags, (err, fd) => {
      this.fd = fd;
      this.emit('open', fd)
    })
  }

  _write(chunk, encoding, clearBuffer) {
    if (typeof this.fd !== 'number') {
      // 由于 fs.open 操作是异步的，所以这里要保证 fs.open 文件打开完毕，再开始写
      return this.once('open', () => this._write(chunk, encoding, clearBuffer))
    }
    fs.write(this.fd, chunk, 0, chunk.length, this.pos, (err, written) => {
      this.pos += written;
      this.len -= written
      clearBuffer(); // 每次写入成功就从缓冲区中依次取出一个出来继续写
    });
  }

  destroy(err) {
    fs.close(this.fd, () => {
      this.emit('close', err);
    });
  }

  // end 相当于 write + close
  end(data) {
    this.write(data, 'utf8', () => {
      this.destroy();
    });
  }
}
```


关键点分析：

1、WriteStream 需要继承 EventEmitter
比如 drain、close、error 等事件都是基于 EventEmitter 实现的。

2、构建一个链表结构的缓冲区，这里为什么不采用数组呢，因为在 WriteStream 中，每次都是从缓冲区中取出第一个数据出来写，如果是数组的话，每次 pop 一个数据出来后，需要涉及到数组的重排，因此这里采用链表的结构明显性能比较高。

3、定义一个属性 _writing 来保存当前是否正在写的状态，当 _writing 为 true 时，代表当前正在写入，当 writing为 false 时，代表当前没有在写入。
```javascript
this._writing = false;// 表示当前是否正在写入
```

4、可写流的特点就是第一次 write 是真正的写，之后的 write 会被保存到缓冲区中，等当前的数据写完再从缓冲区中按顺序读出来继续写。

5、定义一个属性 needDrain, 代表是否需要触发 drain 事件
    当缓冲区的长度和正在写入的长度达到了期望的值 highWaterMark 时，设置为 needDrain 为 true。

6、WriteStream 默认会先 open 文件
```javascript
class WriteStream extends EventEmitter {
  constructor(path, options) {
    super();
    this.path = path;
    this.flags = options.flags || 'w';
    this.highWaterMark = options.highWaterMark || 16 * 1024;
    this.autoClose = options.autoClose || true;
    this.start = options.start || 0;
    this.mode = options.mode || 0o666;
    this.encoding = options.encoding || 'utf8';

    this._writing = false;// 表示当前是否正在写入
    this.cache = new LinkList(); // 缓冲区，如果当前正在写，就把待写入的内容放到缓冲区中
    // 只有当前消耗掉了和期望值相等或者大于期望值的时候 设置成true
    this.needDrain = false; // 当 缓存区的内容 + 正在写入的内容 超过 highWaterMark 时，设置为 true，代表需要出发 drain 事件
    this.pos = this.start; // 写入的位置的偏移量

    this.open(); // 打开文件准备写入 

  }

  open() {
    fs.open(this.path, this.flags, (err, fd) => {
      this.fd = fd;
      this.emit('open', fd)
    })
  }

}
```

7、实现 write

所有可写流都需要实现 stream.Writable 类定义的接口，write 是 stream.Writable 的一个方法，在 write 方法内部会调用子类 (WriteStream) 的 _write ，本文为了方便理解，把 write 的逻辑包含在了 WriteStream 中。

write 主要实现的功能如下：

7-1、将 chunk 统一转化为 Buffer 类型

7-2、根据 _writing 判断当前是否正在写，如果是，将数据存到缓冲区中，否则，调用 _write 进行真正的写数据

7-3、write 函数返回一个 flat 状态，代表目前缓冲区内的数据长度是否小于 highWaterMark，是则可以继续写，不是则不能继续写，并且会触发 drain 事件
```javascript
// 只能写 字符串 或 buffer 类型的数据
  write(chunk, encoding = this.encoding, callback) {
    chunk = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    this.len += chunk.length;
    let flag = this.len < this.highWaterMark;
    this.needDrain = !flag // 当 len >= highWaterMark 时，设置 needDrain 为 true，需要触发 drain 事件

    if (this._writing) {
      // 当前正在写，将待写内容保存到缓冲区中
      this.cache.append({
        chunk,
        encoding,
        callback
      });
    } else {
      // 真正的写入逻辑
      this._writing = true;
      this._write(chunk, encoding, () => {
        callback && callback();
        this.clearBuffer(); // 从缓冲区中取出一个出来写
      });
    }
    return flag; // true: 没有超过 highWaterMark(可以继续写) || false: 超过 highWaterMark(不要继续写了)
  }
```

8、实现 _write 函数

可写流必须实现 stream.Writable 的 writable._write() 或 writable._writev() 方法。
这里实现 writable._write() 方法。

关键点：

8-1、要确保 fs.open 打开成功后拿到 fd 才能开始写。

```javascript
_write(chunk, encoding, clearBuffer) {
    if (typeof this.fd !== 'number') {
      // 由于 fs.open 操作是异步的，所以这里要保证 fs.open 文件打开完毕，再开始写
      return this.once('open', () => this._write(chunk, encoding, clearBuffer))
    }
  }
```

8-2、当写完此次 chunk 的数据后，需要从缓冲区中取出一个出来继续写，直到清空缓冲区里的数据

```javascript
_write(chunk, encoding, clearBuffer) {
    if (typeof this.fd !== 'number') {
      // 由于 fs.open 操作是异步的，所以这里要保证 fs.open 文件打开完毕，再开始写
      return this.once('open', () => this._write(chunk, encoding, clearBuffer))
    }
    fs.write(this.fd, chunk, 0, chunk.length, this.pos, (err, written) => {
      this.pos += written;
      this.len -= written
      clearBuffer(); // 每次写入成功就从缓冲区中依次取出一个出来继续写
    });
  }

  clearBuffer() { // 依次从链表中取出一个出来写
    let obj = this.cache.get();
    if (obj) {
      this._write(obj.chunk, obj.encoding, () => {
        obj.callback && obj.callback();
        this.clearBuffer();
      })
    } else {// obj 为 undefined 说明缓冲区已经清空完毕
      this._writing = false; // 表示当前没有在写，下次再调用 write 可以直接向文件中写入
      if (this.needDrain) {
        // 当 needDrain 为 true 时，需要触发 drain 事件
        this.needDrain = false;
        this.emit('drain')
      }
    }
  }
```


参考文档：

createWriteStream:
http://nodejs.cn/api/fs.html#fs_fs_createwritestream_path_options  

stream.Writable:
http://nodejs.cn/api/stream.html#stream_class_stream_writable


