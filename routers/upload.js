const Router  = require('koa-router')
const router = new Router({ prefix:"/uploads" })
const Result = require('../model/Result')

router.post("/",(ctx) => {
    const files = ctx.request.files.files
    let result = ''
    if(Array.isArray(files)) {
        result = files.map(item=>{
            return {
                fileName: item.originalFilename,
                url: `${ctx.origin}/upload/${item.newFilename}`
            }
        })
    }else {
        result =  {
            fileName: files.originalFilename,
            url: `${ctx.origin}/upload/${files.newFilename}`
        }
    }
    ctx.body = new Result(result,'上传成功').success()
});


module.exports = router;
