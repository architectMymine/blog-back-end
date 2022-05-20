const Router  = require('koa-router')
const router = new Router()

router.get("/", async (ctx) => {
    ctx.body = "hello user";
});

module.exports = router.routes();