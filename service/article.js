const connection = require('../db')

// 新增文章
function addArticle(data) {
    return new Promise((resolve, reject) => {
        connection.execute('INSERT INTO article (name, label, cover, summary, content) VALUES (?,?,?,?,?)', data).then(res => {
            if (!res && res.length === 0) {
                resolve(false)
            } else {
                resolve(true)
            }
        }).catch(e => {
            reject(e)
        })
    })

}

// 获取文章列表
function getArticleList(pageNum, pageSize, condition) {
    if (condition != '') {
        condition = condition.replace(/^where\s+/, ` and `)
    }
    return new Promise((resolve, reject) => {
        const sql = `select articleId, name, label, cover, summary from article where articleId >=
                     (select articleId from article order by articleId limit ${pageNum},1) ${condition}
                     limit ${pageSize}
                    `
        connection.query(sql).then(res => {
            if (!res && res.length === 0) {
                resolve(false)
            } else {
                resolve(res[0])
            }
        }).catch(e => {
            reject(e)
        })
    })

}

// 获取文章总数
function getArticleTotal(condition) {
    return new Promise((resolve, reject) => {
        connection.query(`select count(name) from article ${condition}`).then(res => {
            if (!res && res.length === 0) {
                resolve(false)
            } else {
                resolve(res[0][0]['count(name)'])
            }
        }).catch(e => {
            reject(e)
        })
    })

}

// 获取文章的总页数
function getArticlePageTotal(pageSize, condition) {
    return new Promise((resolve, reject) => {
        connection.query(`select ceil(count(name) / ${pageSize}) as pageTotal from article ${condition}`).then(res => {
            if (!res && res.length === 0) {
                resolve(false)
            } else {
                resolve(res[0][0]['pageTotal'])
            }
        }).catch(e => {
            reject(e)
        })
    })
}

module.exports = {
    addArticle,
    getArticleList,
    getArticleTotal,
    getArticlePageTotal
}
