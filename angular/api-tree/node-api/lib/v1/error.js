
let errMap = new Map([
  [-1, '系统繁忙'],
  [0, '请求成功'],
  [40001, 'access_token无效'],
  [60001, '用户不存在'],
  [60002, '参数错误'],
  [100000, '未知错误']
]);

function getErrorMsg(errcode) {
  errMap.get(errcode)
  return errMap.get(errcode) ? errMap.get(errcode) : errMap.get(100000);
}

exports.getErrorMsg = getErrorMsg;

