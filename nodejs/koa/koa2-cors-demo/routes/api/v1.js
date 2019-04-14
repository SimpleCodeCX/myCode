const router = require('koa-router')();

const user = require('./v1/user');

router.prefix('/v1');

router.use(user.routes(), user.allowedMethods());

router.get('/', function (ctx) {
  ctx.body = 'api/v1';
});

router.get('/errorTest', function () {
  throw (new Error('11111'));
});

module.exports = router;
