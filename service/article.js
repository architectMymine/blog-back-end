const connection = require('../db')
const {
    recombineUpdate
} = require('../utils/index')

const baseSql = `  
               select a.articleId,a.name,group_concat(l.name) as label,a.cover,a.summary,a.content
               from article a,article_label al, label l
               where a.articleId = al.article_id and al.label_id = l.label_id
                `

// 新增文章
function addArticle(data) {
    return new Promise((resolve, reject) => {
        connection.execute('INSERT INTO article (name, cover, summary, content) VALUES (?,?,?,?)', data).then(res => {
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

// 更新文章内容
function updateArticle(data) {
    return new Promise((resolve, reject) => {
        const sql = `update article ${recombineUpdate(data)} where articleId = ${data.articleId}`
        connection.execute(sql).then(res => {
            if (!res && res.length === 0) {
                resolve(false)
            } else {
                resolve(res[0][0])
            }
        }).catch(e => {
            reject(e)
        })
    })
}

// 查询文章
function getArticleDetail(id) {
    return new Promise((resolve, reject) => {
        const sql = `${baseSql} and articleId = ${id}`
        connection.query(sql).then(res => {
            if (!res && res.length === 0) {
                resolve(false)
            } else {
                resolve(res[0][0])
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
        const sql = `
                    ${baseSql} and articleId >=
                    (select a.articleId from article a,article_label al  where a.articleId = al.article_id group by articleId limit ${pageNum},1)
                    ${condition} group by articleId limit ${pageSize}
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

// 获取文章标签
function getArticleLabel() {
    return new Promise((resolve, reject) => {
      connection.query('select name as label,label_id as value from label order by label_id').then(res=>{
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

module.exports = {
    addArticle,
    updateArticle,
    getArticleDetail,
    getArticleList,
    getArticleTotal,
    getArticleLabel,
}
