const timersService = require('./timersService').timersService;

const sendNotification = async () => {
  console.log('------------------------------------------------');
  console.log('发送邮件通知！(发送邮件的逻辑放在这儿！)');
  console.log('------------------------------------------------');
};


timersService(sendNotification);