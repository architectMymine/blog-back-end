const Router = require('koa-router')
const router = new Router({ prefix: "/article" })
const Result = require('../model/Result')
const {
    parsePostData,
    recombineSearch
} = require('../utils/index')

const {
    addArticle,
    getArticleList,
    getArticleTotal,
    getArticlePageTotal
} = require('../service/article')

router.get('/list', async (ctx) => {
    let { pageNum, pageSize } = ctx.request.query
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
        result = new Result(data,'请求成功').success()
    } catch (e) {
        result = new Result('接口错误').error()
    }
    ctx.body = result
})

router.post('/create', async (ctx) => {
    const data = await parsePostData(ctx)
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


module.exports = router;
