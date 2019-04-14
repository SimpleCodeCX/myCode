const router = require('koa-router')();

router.prefix('/user');

router.get('/', function (ctx) {
  ctx.body = 'api/v1/user';
});

module.exports = router;
