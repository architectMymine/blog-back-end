const Koa = require('koa')
const app = new Koa()
const router = require('./routers/index')
app.use(router.routes()).use(router.allowedMethods());

app.listen(3000,()=>{
    console.log('服务启动了')
})