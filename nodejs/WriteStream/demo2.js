let fs = require('fs');
const path = require('path');

// 通过 createWriteStream 可以创建一个 WriteStream 的实例
let ws = fs.createWriteStream(path.resolve(__dirname, './name.txt'), {
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