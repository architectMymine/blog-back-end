const Router = require('koa-router')
const router = new Router({ prefix: "/audio" })
const Result = require('../model/Result')
const {
    createAudio,
    getAudioList,
    getAudioTotal,
    delAudio
} = require('../service/audio')
const {
    parsePostData,
    throwSqlError
} = require("../utils");
const dayjs = require("dayjs");
const { delArticle } = require("../service/article");

// 音频列表
router.get('/list', async (ctx) => {
    let { pageNum, pageSize, name } = ctx.request.query
    ctx.verifyParams({
        pageNum: { type: 'string', required: true },
        pageSize: { type: 'string', required: true },
        name: { type: 'string', required: false, allowEmpty: true }
    }, { pageNum, pageSize, name })
    let page = (pageNum - 1) * pageSize
    let result
    try {
        const list = await getAudioList(page, pageSize, ctx.request.query)
        const allData = await getAudioTotal(ctx.request.query)
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

// 音频添加
router.post('/create', async (ctx) => {
    const data = await parsePostData(ctx)
    let result
    ctx.verifyParams({
        name: { type: 'string', required: true },
        singer: { type: 'string', required: true },
        url: { type: 'string', required: true },
    }, { ...data })

    const audio = [data.name, data.singer, data.url, dayjs().format('YYYY-MM-DD HH:mm:ss'), 0]

    try {
        const audioResult = await createAudio(audio)
        if (audioResult) {
            result = new Result(null, '新建音频成功').success()
        } else {
            result = new Result('新建音频失败').error()
        }
    } catch (e) {
        throwSqlError(ctx, e)
    }
    ctx.body = result
})

// 删除音频
router.delete('/delete', async (ctx) => {
    const { audio_id } = ctx.request.query
    ctx.verifyParams({
        audio_id: { type: 'string', required: true },
    }, { audio_id })
    let result
    try {
        const sqlResult = await delAudio(audio_id)
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
