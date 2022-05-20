const Koa = require('koa')
const KoaBody = require('koa-body')
const BodyParser = require('koa-bodyparser');

const app = new Koa()
const useRoutes = require('./routers/index')

app.use(KoaBody())
app.use(BodyParser())
useRoutes(app)

app.listen(3000,()=>{
    console.log('服务启动了')
})