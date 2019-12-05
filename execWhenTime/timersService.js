const moment = require('moment');

function execWhenTime(hour, minute, second, fn) {

  const seconds = hour * 3600 + minute * 60 + second;

  let timer = null;
  let timerValue = null;

  let currentH;
  let currentM;
  let currentS;
  let currentSeconds;

  let active = false;

  const timerFn = async () => {
    currentH = parseInt(moment().format('HH'), 10);
    currentM = parseInt(moment().format('mm'), 10);
    currentS = parseInt(moment().format('ss'), 10);
    currentSeconds = currentH * 3600 + currentM * 60 + currentS;

    if (currentSeconds - seconds >= 0 && currentSeconds - seconds <= 20 && !active) {
      clearInterval(timer);
      await fn();
      timerValue = 3600001;
      timer = setInterval(timerFn, timerValue);
      active = true;
    }

    const remainSeconds = seconds - currentSeconds >= 0 ? seconds - currentSeconds : seconds - currentSeconds + 24 * 3600;
    if (seconds - currentSeconds > 3610 || seconds - currentSeconds < 0) {
      console.log(`每小时检查一次, 还剩: ${(remainSeconds / 3600).toFixed(2)} 小时触发定时通知!`);
      // 每小时执行一次
      if (timerValue !== 3600000) {
        active = false;
        timerValue = 3600000;
        clearInterval(timer);
        timer = setInterval(timerFn, timerValue);
      }
    } else {
      if (seconds - currentSeconds > 610) {
        console.log(`每10分钟检查一次, 还剩: ${remainSeconds} 秒触发定时通知! `);
        // 每10分钟执行一次
        if (timerValue !== 600000) {
          timerValue = 600000;
          clearInterval(timer);
          timer = setInterval(timerFn, timerValue);
        }
      } else {
        if (seconds - currentSeconds > 65) {
          console.log(`每1分钟检查一次, 还剩: ${remainSeconds} 秒触发定时通知!`);
          // 每分钟执行一次
          if (timerValue !== 60000) {
            timerValue = 60000;
            clearInterval(timer);
            timer = setInterval(timerFn, timerValue);
          }
        } else {
          console.log(`每秒钟检查一次, 还剩: ${remainSeconds} 秒触发定时通知!`);
          // 每秒钟执行一次
          if (timerValue !== 1000) {
            timerValue = 1000;
            clearInterval(timer);
            timer = setInterval(timerFn, timerValue);
          }
        }
      }
    }
  };

  timerFn();

}

exports.timersService = (hour, minute, second, fn) => {
  execWhenTime(hour, minute, second, fn);
};


