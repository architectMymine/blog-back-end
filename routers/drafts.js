const Router = require('koa-router')
const router = new Router({ prefix: "/drafts" })
const Result = require('../model/Result')
const dayjs = require("dayjs");
const { parsePostData, throwSqlError } = require("../utils");
const {
    getDarftsList,
    createArticleDrafts,
    updateArticleDrafts,
    getDraftsDetail,
    delArticleDrafts
} = require('../service/drafts')

// 草稿列表
router.get('/list', async (ctx) => {
    let result = {}
    try {
        const list = await getDarftsList()
        if (list) {
            result = new Result(list, '请求成功').success()
        } else {
            result = new Result(e, '请求失败').error()
        }
    } catch (e) {
        throwSqlError(ctx, e)
    }
    ctx.body = result
})

// 新建草稿
router.post('/create', async (ctx) => {
    const data = await parsePostData(ctx)
    let result = {}
    ctx.verifyParams({
        name: { type: 'string', required: true },
        article_id: { type: 'number', required: false, allowEmpty: true },
        label: { type: 'array', required: false, allowEmpty: true },
        cover: { type: 'string', required: false, allowEmpty: true },
        summary: { type: 'string', required: false, allowEmpty: true },
        content: { type: 'string', required: false, allowEmpty: true },
    }, { ...data })
    try {
        const drafts = [
            data.article_id ? data.article_id : 0,
            new Date().getTime() + '',
            data.name,
            data.label.length > 0 ? data.label.join(',') : '',
            data.cover,
            data.summary,
            data.content,
            dayjs().format('YYYY-MM-DD HH:mm:ss'),
            null,
            0
        ]
        const draftsResult = await createArticleDrafts(drafts)
        if (draftsResult.insertId) {
            const detail = await getDraftsDetail({ id: draftsResult.insertId })
            result = new Result(detail, '请求成功').success()
        } else {
            result = new Result('接口错误').error()
        }

    } catch (e) {
        throwSqlError(ctx, e)
    }
    ctx.body = result
})

// 更新草稿
router.post('/update', async (ctx) => {
    const data = await parsePostData(ctx)
    let result = {}
    ctx.verifyParams({
        drafts_id: { type: 'string', required: true },
        name: { type: 'string', required: false, allowEmpty: true },
        label: { type: 'array', required: false, allowEmpty: true },
        cover: { type: 'string', required: false, allowEmpty: true },
        summary: { type: 'string', required: false, allowEmpty: true },
        content: { type: 'string', required: false, allowEmpty: true },
    }, { ...data })
    try {
        await updateArticleDrafts(data)
        result = new Result(null, '更新草稿文章成功').success()
    } catch (e) {
        throwSqlError(ctx, e)
    }
    ctx.body = result
})

// 草稿详情
router.get('/detail', async (ctx) => {
    const { drafts_id } = ctx.request.query
    ctx.verifyParams({
        drafts_id: { type: 'string', required: true },
    }, { drafts_id })
    let result = {}
    try {
        const detail = await getDraftsDetail({ drafts_id })
        if (detail) {
            result = new Result(detail, '请求成功').success()
        } else {
            result = new Result(null, '未找到草稿').success()
        }
    } catch (e) {
        throwSqlError(ctx, e)
    }
    ctx.body = result
})

// 删除草稿
router.delete('/delete', async (ctx) => {
    const { drafts_id } = ctx.request.query
    ctx.verifyParams({
        drafts_id: { type: 'string', required: true },
    }, { drafts_id })
    let result = {}
    try {
        const sqlResult = await delArticleDrafts(drafts_id)
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
