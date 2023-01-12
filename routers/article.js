const Router = require('koa-router')
const router = new Router({ prefix: "/article" })
const Result = require('../model/Result')
const {
    parsePostData,
    recombineSearch,
} = require('../utils/index')

const {
    addArticle,
    updateArticle,
    getArticleDetail,
    getArticleList,
    getArticleTotal,
    getArticlePageTotal
} = require('../service/article')

router.get('/list', async (ctx) => {
    let { pageNum, pageSize } = ctx.request.query
    ctx.verifyParams({
        pageNum: { type: 'string', require: true },
        pageSize: { type: 'string', require: true },
    }, { pageNum, pageSize })
    let page = (pageNum - 1) * pageSize
    const searchSql = recombineSearch(ctx.request.query, ['name', 'label'])
    let result = ''
    try {
        const list = await getArticleList(page, pageSize, searchSql)
        const allData = await getArticleTotal(searchSql)
        const pageTotal = await getArticlePageTotal(pageSize, searchSql)
        const data = {
            list,
            page_total: Number(pageTotal),
            page_size: Number(pageSize),
            current_page: Number(pageNum),
            all_data: allData
        }
        result = new Result(data, '请求成功').success()
    } catch (e) {
        result = new Result('接口错误').error()
    }
    ctx.body = result
})

router.post('/create', async (ctx) => {
    const data = await parsePostData(ctx)
    ctx.verifyParams({
        name: { type: 'string', require: true },
        label: { type: 'string', require: true },
        cover: { type: 'string', require: true },
        summary: { type: 'string', require: true },
        content: { type: 'string', require: true },
    }, { ...data })
    const article = [data.name, data.label, data.cover, data.summary, data.content]
    const sqlResult = addArticle(article)
    let result = ''
    if (sqlResult) {
        result = new Result(null, '创建文章成功').success()
    } else {
        result = new Result(null, '创建文章失败').error()
    }
    ctx.body = result
})

router.post('/update', async (ctx) => {
    const data = await parsePostData(ctx)
    ctx.verifyParams({
        articleId: { type: 'string', require: true },
        name: { type: 'string', require: true },
        label: { type: 'string', require: true },
        cover: { type: 'string', require: true },
        summary: { type: 'string', require: true },
        content: { type: 'string', require: true },
    }, { ...data })
    const sqlResult = updateArticle(data)
    // console.log('sqlResult',sqlResult.sql)
    let result = {}
    if (!sqlResult === false) {
        result = new Result(null, '更新文章成功').success()
    } else {
        result = new Result(null, '更新文章失败').error()
    }
    ctx.body = result

})


router.get('/detail', async (ctx) => {
    const { articleId } = ctx.request.query
    ctx.verifyParams({
        articleId: { type: 'string', require: true },
    }, { articleId })
    const detail = await getArticleDetail(articleId)
    let result = {}
    if (detail) {
        result = new Result(detail, '').success()
    } else {
        result = new Result('未找到文章').error()
    }
    ctx.body = result
})


module.exports = router;
