const router = require('koa-router')();

router.get('/', async (ctx) => {
  await ctx.render('index', {
    title: 'Welcome to Simple nodejs api!'
  });
});


module.exports = router;
