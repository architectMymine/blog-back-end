const Router = require('koa-router')
const router = new Router({ prefix: "/main" })
const dayjs = require('dayjs')
const {
    getDailySentence
} = require('../utils/axios')
const Result = require('../model/Result')

/**
 * 词霸每日一句
 */
router.get('/daily', async (ctx) => {
    let result, daily
    const { date } = ctx.request.query
    daily = date ? date : dayjs().format('YYYY-MM-DD')
    try {
        const res = await getDailySentence(daily)
        const data = {
            title: res.title,
            content: res.content,
            note: res.note,
            tts: res.tts,
            picture: res.picture2
        }
        result = new Result(data, '成功').success()
    } catch (e) {
        result = new Result('error').error()
    }
    ctx.body = result
})


module.exports = router;
