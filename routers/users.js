const Router = require('koa-router')
const router = new Router({ prefix: "/users" })
const connect = require('../db/index')
const {
    parsePostData
} = require('../utils/index')
const Result = require('../model/Result')
const {
    findUser
} = require('../service/user')

const jwt = require('jsonwebtoken')
const {
    TOKEN_SECRET,
    JWT_EXPIRED
} = require('../utils/constant')

router.get("/", async (ctx) => {
    console.log('ctx.request.query', ctx.request.query)
    const { name = '', age = '', sex = '' } = ctx.request.query
    const statement = `INSERT INTO users (name, age,sex) VALUES (?,?,?);`
    ctx.body = await connect.execute(statement, [name, age, sex])
});


router.post('/login', async (ctx) => {
    const data = await parsePostData(ctx)
    ctx.verifyParams({
        username: { type: 'string', require: true },
        password: { type: 'string', require: true },
    }, { ...data })
    let result = {}
    await findUser(data.username, data.password).then(user => {
        if(!user && user.length === 0) {
            result =  new Result(null,'账号或密码错误').error()
        }else {
            const token = jwt.sign(
                { username: data.username },
                TOKEN_SECRET,
                { expiresIn: JWT_EXPIRED }
            )
            result = new Result({ token },'登录成功').success()
        }
    })
    ctx.body = result
})

router.post('/offer', async (ctx) => {
    const data = await parsePostData(ctx)
    ctx.verifyParams({
        age: { type: 'number', require: true },
        name: { type: 'number', require: true }
    }, { ...data })
    ctx.body = new Result(data, '访问成功').success()
})


module.exports = router;
