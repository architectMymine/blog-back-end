const Router = require('koa-router')
const router = new Router({ prefix: "/users" })
const connect = require('../db/index')
const {
    parsePostData
} = require('../utils/index')
const Result = require('../model/Result')
const {
    findUser,
    getUserInfo
} = require('../service/user')

const jwt = require('jsonwebtoken')
const {
    TOKEN_SECRET,
    JWT_EXPIRED
} = require('../utils/constant')

router.get("/", async (ctx) => {
    // console.log('ctx.request.query', ctx.request.query)
    const { name = '', age = '', sex = '' } = ctx.request.query
    const statement = `INSERT INTO users (name, age,sex) VALUES (?,?,?);`
    ctx.body = await connect.execute(statement, [name, age, sex])
});

// 登录接口
router.post('/login', async (ctx) => {
    const data = await parsePostData(ctx)
    ctx.verifyParams({
        username: { type: 'string', require: true },
        password: { type: 'string', require: true },
    }, { ...data })
    let result = {}
    const user = await findUser(data.username, data.password)
    if (!user && user.length === 0) {
        result = new Result(null, '账号或密码错误').error()
    } else {
        const token = jwt.sign(
            { username: data.username },
            TOKEN_SECRET,
            { expiresIn: JWT_EXPIRED }
        )
        result = new Result({ token }, '登录成功').success()
    }
    ctx.body = result
})

// 获取用户信息
router.get('/info', async (ctx) => {
    let token = ctx.header.authorization
    if (token.includes('Bearer ')) {
        token = token.replace('Bearer ', '')
    }
    // 解析token
    const decode = jwt.verify(token, TOKEN_SECRET)
    let result = {}
    if (decode && decode.username) {
        const userInfo = await getUserInfo(decode.username)
        if (!userInfo) {
            result = new Result(null, '获取用户信息失败').error()
        } else {
            result = new Result(userInfo, '获取用户信息成功').success()
        }
    } else {
        result = new Result(null, '解析用户信息失败').error()
    }
    ctx.body = result
})


module.exports = router;
