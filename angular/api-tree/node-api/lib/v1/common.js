const logger = require('./logger')('lib/v1/common.js');
const error = require('./error');
const a = require('./test');
console.log(a)


// 验证参数是否为空
function checkParamsIsNullOrError(params) {
  for (let param of params) {
    if (param === "" || param === undefined || param === null || param === []) {
      return true;
    }
    if (Array.prototype.isPrototypeOf(param) && param.length === 0) { return true; }
    if (Object.prototype.isPrototypeOf(param) && Object.keys(param).length === 0) { return true; }
  }
  return false;
}

// 封装正常响应头
function apiNormalResponseFormat(_data) {
  return {
    errcode: 0,
    errmsg: "ok",
    data: _data
  }
}

// 封装错误响应头
function apiErrorResponseFormat(errcode) {
  return {
    errcode: errcode,
    errmsg: error.getErrorMsg(errcode)
  }
}


exports.checkParamsIsNullOrError = checkParamsIsNullOrError;
exports.apiNormalResponseFormat = apiNormalResponseFormat;
exports.apiErrorResponseFormat = apiErrorResponseFormat;