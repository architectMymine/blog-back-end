const Router = require('koa-router')
const router = new Router({ prefix: "/users" })
const connect = require('../db/index')
const {
    parsePostData
} = require('../utils/index')
const Result = require('../model/Result')
const {
    findUser,
} = require('../service/user')
const jwt = require('jsonwebtoken')
const {
    TOKEN_SECRET,
    JWT_EXPIRED
} = require('../utils/constant')

const { getUserDetail } = require('../utils/user')


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
        username: { type: 'string', required: true },
        password: { type: 'string', required: true },
    }, { ...data })
    let result = {}
    const sqlResult = await findUser(data.username, data.password)
    if (sqlResult) {
        // 签发token
        const token = jwt.sign(
            { username: data.username },
            TOKEN_SECRET,
            { expiresIn: JWT_EXPIRED }
        )
        result = new Result({ token }, '登录成功').success()
    } else {
        result = new Result(null, '账号或密码错误').error()
    }
    ctx.body = result
})

// 获取用户信息
router.get('/info', async (ctx) => {
    let result
    try {
        const userInfo = await getUserDetail(ctx)
        if (userInfo) {
            result = new Result(userInfo, '获取用户信息成功').success()
        } else {
            result = new Result(null, '获取用户信息失败').error()
        }
    } catch (e) {
        result = new Result(null, '解析用户信息失败').error()
    }
    ctx.body = result
})


module.exports = router;
