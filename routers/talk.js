const Router = require('koa-router')
const router = new Router({ prefix: "/talk" })
const Result = require('../model/Result')
const dayjs = require("dayjs");
const { parsePostData, throwSqlError } = require("../utils");
const {
    getTalkList,
    getTalkTotal,
    creatTalk,
    alterTalk,
    delTalk
} = require('../service/talk')
const { getUserDetail } = require('../utils/user')


// 说说列表
router.get('/list', async (ctx) => {
    let { pageNum, pageSize, username } = ctx.request.query
    ctx.verifyParams({
        pageNum: { type: 'string', required: true },
        pageSize: { type: 'string', required: true },
        username: { type: 'string', required: false, allowEmpty: true },
    }, { pageNum, pageSize, username: username ? username : '' })
    let page = (pageNum - 1) * pageSize
    let result
    try {
        const list = await getTalkList(page, pageSize, ctx.request.query)
        const allData = await getTalkTotal(ctx.request.query)
        const pageTotal = Math.ceil(allData.length / Number(pageSize))
        const data = {
            list,
            page_total: pageTotal,
            page_size: Number(pageSize),
            current_page: Number(pageNum),
            all_data: allData.length
        }
        result = new Result(data, '请求成功').success()
    } catch (e) {
        throwSqlError(ctx, e)
    }
    ctx.body = result
})

// 新增说说
router.post('/create', async ctx => {
    const data = await parsePostData(ctx)
    const userInfo = await getUserDetail(ctx)
    let result
    const talk = [
        userInfo.user_id,
        data.content,
        data.photo,
        dayjs().format('YYYY-MM-DD HH:mm:ss'),
        null,
        0
    ]
    try {
        let talkResult = creatTalk(talk)
        if (talkResult) {
            result = new Result(null, '新建说说成功').success()
        } else {
            result = new Result('新建说说失败').error()
        }
    } catch (e) {
        throwSqlError(ctx, e)
    }
    ctx.body = result
})

// 修改说说
router.post('/update', async (ctx) => {
    const data = await parsePostData(ctx)
    let result
    ctx.verifyParams({
        talk_id: { type: 'number', required: true },
        content: { type: 'string', required: true },
        photo: { type: 'string', required: true },
    }, { ...data })
    try {
        const res = await alterTalk(data)
        if (res. affectedRows > 0) {
            result = new Result(null, '更新说说成功').success()
        } else {
            result = new Result(null, '更新说说失败').error()
        }
    } catch (e) {
        throwSqlError(ctx, e)
    }
    ctx.body =  result
})

// 删除说说
router.del('/delete', async (ctx) => {
    const { talk_id } = ctx.request.query
    ctx.verifyParams({
        talk_id: { type: 'string', required: true },
    }, { talk_id })
    let result
    try {
        const sqlResult = await delTalk(talk_id)
        if (sqlResult) {
            result = new Result(null, '删除成功').success()
        } else {
            result = new Result('删除失败').error()
        }
    } catch (e) {
        throwSqlError(ctx, e)
    }
    ctx.body = result
})


module.exports = router;
