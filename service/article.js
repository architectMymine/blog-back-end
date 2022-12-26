const connection = require('../db')

// 新增文章
function addArticle(data) {
    return connection.execute('INSERT INTO article (name, label, cover, summary, content) VALUES (?,?,?,?,?)',data)
}

// 获取文章列表
function getArticleList({pageNum,pageSize}) {
    return connection.query(`select name as article_name, label, cover, summary, content from article LIMIT ${pageNum},${pageSize}`)
}

// 获取文章总数
function getArticleTotal() {
    return connection.query('select count(*) from article')
}

// 获取文章的总页数
function getArticlePageTotal(pageSize) {
    return connection.query(`select ceil(count(*) / ${pageSize}) as pageTotal from article`)
}

module.exports = {
    addArticle,
    getArticleList,
    getArticleTotal,
    getArticlePageTotal
}
