const router = require('koa-router')()

router.prefix('/users')

router.get('/', function (ctx, next) {
  const users = [
    { userId: 1, name: 'dong1', age: 25, hobby: 'guitar' },
    { userId: 2, name: 'dong2', age: 26, hobby: 'piano' },
    { userId: 3, name: 'dong3', age: 27, hobby: 'drum' }
  ];
  ctx.body = {
    code: 0,
    data: users
  }
})

router.get('/bar', function (ctx, next) {
  ctx.body = 'this is a users/bar response'
})

module.exports = router
