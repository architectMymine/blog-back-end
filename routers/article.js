const Router = require('koa-router')
const router = new Router({ prefix: "/article" })
const Result = require('../model/Result')
const {
    parsePostData
} = require('../utils/index')

const {
    addArticle,
    getArticleList,
    getArticleTotal,
    getArticlePageTotal
} = require('../service/article')

router.get('/list', async (ctx) => {
    const { pageNum, pageSize } = ctx.request.query
    ctx.body = new Result(null, '博客列表接口').success()
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
