let fs = require('fs');
const path = require('path');

// 通过 createWriteStream 可以创建一个 WriteStream 的实例
let ws = fs.createWriteStream(path.resolve(__dirname, './name.txt'), {
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