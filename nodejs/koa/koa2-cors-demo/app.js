const Koa = require('koa');
const app = new Koa();
const views = require('koa-views');
const json = require('koa-json');
const onerror = require('koa-onerror');
const koaBody = require('koa-body');
const koaLogger = require('koa-logger');
const koaStaticServer = require('koa-static-server');
const favicon = require('koa-favicon');
const logger = require('./lib').logger();
const index = require('./routes/index');
const api = require('./routes/api');
const {
  koaCors: cors,
  koaError: handleError,
  notFound: notFound
} = require('./middlewares');

/**
 * 由于原生的koa的context.onerror不够全面,
 * 因此这里重写context.onerror
 */
onerror(app);

/**
 * 由于 Koa extends EventEmitter,因此这里监听全局EventEmitter的error事件,
 * 可以通过ctx.app.emit('error', err)触发事件
 */
app.on('error', (err) => {
  if (!err.expose) {
    logger.error(`error: ${err.message} \n stack: ${err.stack} \n`);
  }
});

// 捕获未被处理的promise rejection
process.on('unhandledRejection', (err) => {
  logger.fatal(`unhandledRejection: ${err.message}, stack: ${err.stack}`);
});

// 捕获未被处理的异常
process.on('uncaughtException', (err) => {
  logger.fatal(`uncaughtException: ${err.message}, stack: ${err.stack}`);
});

app.use(handleError); // 统一处理错误响应信息
app.use(cors); // 跨域
app.use(koaLogger()); // 打印每一次接口请求响应时间
/**
 * if ctx.path==='/favicon.ico',
 * return {root}/static/favicon.ico的静态文件
 * 并且设置该文件的Cache-Control缓存
 */
app.use(favicon(__dirname + '/static/favicon.ico'));
app.use(koaStaticServer({ rootDir: 'static', rootPath: '/static' }));
app.use(koaBody({
  multipart: true,
  formidable: {
    maxFileSize: 2000 * 1024 * 1024    // 设置上传文件大小最大限制，默认2M
  },
  formLimit: '2mb',
  jsonLimit: '2mb',
  textLimit: '2mb'
}));

app.use(json());

app.use(views(__dirname + '/views', {
  extension: 'pug'
}));

/**
 * routes
 */
app.use(index.routes(), index.allowedMethods());
app.use(api.routes(), api.allowedMethods());

/**
 * 统一处理找不到的资源,建议把这个中间件放在路由后面
 */
app.use(notFound);


module.exports = app;

