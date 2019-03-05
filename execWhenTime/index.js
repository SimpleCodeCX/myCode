const { timersService } = require('./timersService');

const sendNotification = async () => {
  console.log('------------------------------------------------');
  console.log('发送邮件通知！(发送邮件的逻辑放在这儿！)');
  console.log('------------------------------------------------');
};


// 每天 10:00 定时发送邮件
timersService(10, 0, 0, sendNotification);