module.exports = async function (ctx) {
  ctx.response.type = 'text/html';
  ctx.response.body = '<h1>error: api or url not found!</h1>';
};