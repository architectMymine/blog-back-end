const Router  = require('koa-router')
const router = new Router({ prefix:"/uploads" })
const Result = require('../model/Result')

router.post("/",(ctx) => {
    const files = ctx.request.files.files
    const urlList = files.map(item=>{
        return {
            fileName: item.originalFilename,
            url: `${ctx.origin}/upload/${item.newFilename}`
        }
    })
    ctx.body = new Result(urlList,'上传成功').success()
});


module.exports = router;
