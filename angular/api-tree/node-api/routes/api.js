const router = require('koa-router')()

const v1 = require('./api/v1')

router.prefix('/api')

router.use(v1.routes(), v1.allowedMethods())

router.get('/', async (ctx, next) => {
  ctx.body = 'api'
})


module.exports = router
