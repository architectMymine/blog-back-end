const Router  = require('koa-router')
const router = new Router({ prefix:"/users" })
const connect = require('../db/index')

router.get("/", async (ctx) => {
    console.log('ctx.request.query',ctx.request.query)
    // const { name='', age='',sex='' }  = ctx.request.query
    // const statement = `INSERT INTO users (name, age,sex) VALUES (?,?,?);`
    // ctx.body  = await connect.execute(statement, [name, age,sex])
    ctx.body = ctx
});

router.post('/offer',async (ctx) =>{
    ctx.body = ctx
})

module.exports = router;
