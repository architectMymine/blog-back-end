const Router = require('koa-router')
const router = new Router({ prefix: "/article" })
const Result = require('../model/Result')
const {
    createArticle,
    updateArticle,
    insertLabel,
    updateLabel,
    getArticleDetail,
    getArticleList,
    getArticleTotal,
    getArticleLabel,
    getLableHaveArticle,
    delArticle,
} = require('../service/article')
const dayjs = require("dayjs");
const { parsePostData, throwSqlError } = require("../utils");
const { delArticleDrafts, getDraftsDetail } = require("../service/drafts");

// 文章列表
router.get('/list', async (ctx) => {
    let { pageNum, pageSize, name, label } = ctx.request.query
    ctx.verifyParams({
        pageNum: { type: 'string', required: true },
        pageSize: { type: 'string', required: true },
    }, { pageNum, pageSize, name, label })
    let page = (pageNum - 1) * pageSize
    let result
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
        throwSqlError(ctx, e)
    }
    ctx.body = result
})

// 新建文章
router.post('/create', async (ctx) => {
    const data = await parsePostData(ctx)
    let result
    ctx.verifyParams({
        drafts_id: { type: 'string', required: true },
        name: { type: 'string', required: true },
        label: { type: 'array', required: true },
        cover: { type: 'string', required: true },
        summary: { type: 'string', required: true },
        content: { type: 'string', required: true },
    }, { ...data })
    const article = [
        data.name,
        data.cover,
        data.summary,
        data.content,
        0,
        dayjs().format('YYYY-MM-DD HH:mm:ss'),
        null
    ]
    try {
        // 删除草稿文章
        if (data.drafts_id) await delArticleDrafts(data.drafts_id)
        // 添加文章
        const articleResult = await createArticle(article)
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
    } catch (e) {
        throwSqlError(ctx, e)
    }

    ctx.body = result
})

// 更新文章
router.post('/update', async (ctx) => {
    const data = await parsePostData(ctx)
    let result
    ctx.verifyParams({
        article_id: { type: 'string', required: true },
        name: { type: 'string', required: true },
        label: { type: 'array', required: true },
        cover: { type: 'string', required: true },
        summary: { type: 'string', required: true },
        content: { type: 'string', required: true },
        drafts_id: { type: 'string', required: false, allowEmpty: true },
    }, { ...data })
    try {
        // 更新文章
        await updateArticle(data)
        // 更新标签
        await updateLabel(data)
        // 删除草稿文章
        if (data.drafts_id) await delArticleDrafts(data.drafts_id)
        result = new Result(null, '更新文章成功').success()
    } catch (e) {
        throwSqlError(ctx, e)
    }
    ctx.body = result

})

// 文章详情
router.get('/detail', async (ctx) => {
    const { article_id } = ctx.request.query
    let result
    ctx.verifyParams({
        article_id: { type: 'string', required: true },
    }, { article_id })
    try {
        // 先查草稿表
        // ifCreate 是否已经创建 0：是 1：否
        const draftsDetail = await getDraftsDetail({ article_id })
        if (draftsDetail) {
            draftsDetail.ifCreate = 0
            result = result = new Result(draftsDetail, '请求成功').success()
        } else {
            const articleDetail = await getArticleDetail(article_id)
            if (!articleDetail === false) {
                articleDetail.ifCreate = 1
                result = new Result(articleDetail, '请求成功').success()
            } else {
                result = new Result('未找到文章').error()
            }
        }
    } catch (e) {
        throwSqlError(ctx, e)
    }
    ctx.body = result
})

// 文章删除
router.delete('/delete', async (ctx) => {
    const { article_id } = ctx.request.query
    ctx.verifyParams({
        article_id: { type: 'string', required: true },
    }, { article_id })
    let result
    try {
        const sqlResult = await delArticle(article_id)
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

// 文章标签
router.get('/label', async (ctx) => {
    let result
    try {
        const sqlResult = await getArticleLabel()
        if (!sqlResult === false) {
            result = new Result(sqlResult, '请求完成').success()
        } else {
            result = new Result('获取标签失败').error()
        }
    } catch (e) {
        throwSqlError(ctx, e)
    }
    ctx.body = result
})

// 标签下有文章的标签
router.get('/label_with_article', async (ctx) => {
    let result
    try {
        const sqlResult = await getLableHaveArticle()
        if (!sqlResult === false) {
            result = new Result(sqlResult, '请求完成').success()
        } else {
            result = new Result('获取标签失败').error()
        }
    } catch (e) {
        throwSqlError(ctx, e)
    }
    ctx.body = result
})



module.exports = router;
