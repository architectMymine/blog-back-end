const Router  = require('koa-router')
const router = new Router({ prefix:"/uploads" })
const path = require("path")

router.post("/",(ctx) => {
    const files = ctx.request.files.files
    const urlList = files.map(item=>{
        return {
            fileName: item.originalFilename,
            url: `${ctx.origin}/upload/${item.newFilename}`
        }
    })
    ctx.body = urlList
});


module.exports = router;
