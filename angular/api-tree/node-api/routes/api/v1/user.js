const router = require('koa-router')();
const common = require('../../../lib/v1').common;
const userBll = require('../../../lib/v1/bll').userBll;
router.prefix('/user');

router.get('/:id', async (ctx, next) => {
  const id = ctx.params.id;
  const params = [id];
  // 验证参数是否为空
  if (common.checkParamsIsNullOrError(params)) {
    return ctx.body = common.apiErrorResponseFormat(60002);
  }
  // 获取数据
  const userInfo = userBll.getById(id);
  if (!userInfo) {
    return ctx.body = common.apiErrorResponseFormat(60001);
  }
  return ctx.body = common.apiNormalResponseFormat(userInfo);
});

router.get('/getByName/:name', async (ctx, next) => {
  const name = ctx.params.name;
  const params = [name];
  // 验证参数是否为空
  if (common.checkParamsIsNullOrError(params)) {
    return ctx.body = common.apiErrorResponseFormat(60002);
  }
  // 获取数据
  const userInfo = userBll.getByName(name);
  if (!userInfo) {
    return ctx.body = common.apiErrorResponseFormat(60001);
  }
  return ctx.body = common.apiNormalResponseFormat(userInfo);
});

router.get('/getByAge/:age', async (ctx, next) => {
  const age = ctx.params.age;
  const params = [age];
  // 验证参数是否为空
  if (common.checkParamsIsNullOrError(params)) {
    return ctx.body = common.apiErrorResponseFormat(60002);
  }
  // 获取数据
  const userList = userBll.getByAge(age);
  if (userList.length === 0) {
    return ctx.body = common.apiErrorResponseFormat(60002);
  }
  return ctx.body = common.apiNormalResponseFormat(userList);
});



module.exports = router;
