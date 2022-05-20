const Router  = require('koa-router')
const router = new Router({ prefix:"/users" })
const connect = require('../db/index')

router.get("/", async (ctx) => {
    const { name='', age='',sex='' }  = ctx.request.query
    const statement = `INSERT INTO users (name, age,sex) VALUES (?,?,?);`
    const result = await connect.execute(statement, [name, age,sex])
    ctx.body = result
});

router.get('/offer',async (ctx) =>{
    ctx.body = 'offer route'
})

module.exports = router;