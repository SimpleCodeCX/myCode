const WriteStream = require('./WriteStream');

// 通过 createWriteStream 可以创建一个 WriteStream 的实例
let ws = new WriteStream('./name.txt', {
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