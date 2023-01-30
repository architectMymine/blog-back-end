const Router = require('koa-router')
const router = new Router({ prefix: "/article" })
const Result = require('../model/Result')

const {
    addArticle,
    updateArticle,
    insertLabel,
    updateLabel,
    getArticleDetail,
    getArticleList,
    getArticleTotal,
    getArticleLabel,
    delArticle,
} = require('../service/article')

// 文章列表
router.get('/list', async (ctx) => {
    let { pageNum, pageSize } = ctx.request.query
    ctx.verifyParams({
        pageNum: { type: 'string', require: true },
        pageSize: { type: 'string', require: true },
    }, { pageNum, pageSize })
    let page = (pageNum - 1) * pageSize
    let result = ''
    try {
        const list = await getArticleList(page, pageSize, ctx.request.query)
        const allData = await getArticleTotal(ctx.request.query)
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
        result = new Result(e, '接口错误').error()
    }
    ctx.body = result
})


// 新建文章
router.post('/create', async (ctx) => {
    const data = await parsePostData(ctx)
    let result = {}
    ctx.verifyParams({
        name: { type: 'string', require: true },
        label: { type: 'array', require: true },
        cover: { type: 'string', require: true },
        summary: { type: 'string', require: true },
        content: { type: 'string', require: true },
    }, { ...data })
    const article = [data.name, data.cover, data.summary, data.content, 0]
    // 添加文章
    const articleResult = await addArticle(article)
    if (articleResult?.insertId) {
        // 插入文章标签中间表
        const labelResult = await insertLabel(articleResult.insertId, data.label)
        if (labelResult?.warningStatus === 0) {
            result = new Result(null, '创建文章成功').success()
        } else {
            result = new Result(null, '文章标签插入失败').error()
        }
    } else {
        result = new Result(null, '创建文章失败').error()
    }
    ctx.body = result
})

// 更新文章
router.post('/update', async (ctx) => {
    const data = await parsePostData(ctx)
    let result = {}
    ctx.verifyParams({
        article_id: { type: 'string', require: true },
        name: { type: 'string', require: true },
        label: { type: 'array', require: true },
        cover: { type: 'string', require: true },
        summary: { type: 'string', require: true },
        content: { type: 'string', require: true },
    }, { ...data })
    try {
        await updateArticle(data)
        await updateLabel(data)
        result = new Result(null, '更新文章成功').success()
    } catch (e) {
        result = new Result(e, '更新文章失败').error()
    }
    ctx.body = result

})

// 文章详情
router.get('/detail', async (ctx) => {
    const { article_id } = ctx.request.query
    ctx.verifyParams({
        article_id: { type: 'string', require: true },
    }, { article_id })
    const detail = await getArticleDetail(article_id)
    let result = {}
    if (!detail === false) {
        result = new Result(detail, '请求完成').success()
    } else {
        result = new Result('未找到文章').error()
    }
    ctx.body = result
})

router.delete('/delete', async (ctx) => {
    const { article_id } = ctx.request.query
    ctx.verifyParams({
        article_id: { type: 'string', require: true },
    }, { article_id })
    let result = {}
    try {
        const sqlResult = await delArticle(article_id)
        if (sqlResult) {
            result = new Result(null, '操作成功').success()
        } else {
            result = new Result('未找到对应文章').error()
        }
    } catch (e) {
        result = new Result(e,'sql执行错误').error()
    }
    ctx.body = result
})

// 文章标签
router.get('/label', async (ctx) => {
    const sqlResult = await getArticleLabel()
    let result = {}
    if (!sqlResult === false) {
        result = new Result(sqlResult, '请求完成').success()
    } else {
        result = new Result('接口错误').error()
    }
    ctx.body = result
})


module.exports = router;
