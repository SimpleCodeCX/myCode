module.exports = async function (ctx) {
  ctx.response.type = 'text/html';
  ctx.response.body = '<h1 style="color:red;display:flex;justify-content:center;margin-top:100px;">error: api or url not found!</h1>';
};