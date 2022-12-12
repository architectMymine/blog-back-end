const Router = require('koa-router')
const router = new Router({prefix: "/users"})
const connect = require('../db/index')
const {parsePostData} = require('../utils/index')

router.get("/", async (ctx) => {
    console.log('ctx.request.query', ctx.request.query)
    // const { name='', age='',sex='' }  = ctx.request.query
    // const statement = `INSERT INTO users (name, age,sex) VALUES (?,?,?);`
    // ctx.body  = await connect.execute(statement, [name, age,sex])
    ctx.body = {
        code: 0,
        data: ctx.request.query
    }
});


router.get('/login', async ctx => {
    ctx.body = '登录接口'
})

router.post('/offer', async (ctx) => {
    const data = await parsePostData(ctx)
    ctx.verifyParams({
        age: { type: 'number', require: true },
        name: { type: 'number', require: true }
    }, {...data})
    ctx.body = {
        code: 0,
        message: 'success',
        data
    }
})


module.exports = router;
