const Router  = require('koa-router')
const router = new Router({ prefix:"/article" })
const Result = require('../model/Result')

router.get('/list',async (ctx)=>{
    ctx.body = new Result(null,'博客列表接口').success()
})

module.exports = router;
