const router = require('koa-router')()

const user = require('./v1/user')

router.prefix('/v1/')

router.use(user.routes(), user.allowedMethods())

router.get('/', function (ctx, next) {
  ctx.body = 'api/v1'
})

module.exports = router
