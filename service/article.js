const connection = require('../db')
const {
    recombineUpdate
} = require('../utils/index')
const dayjs = require('dayjs')

// 新增文章
function addArticle(data) {
    return new Promise((resolve, reject) => {
        connection.execute('INSERT INTO article (name, cover, summary, content, deleted) VALUES (?,?,?,?,?)', data).then(res => {
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

// 写入文章标签中间表
function insertLabel(article_id, labelArray) {
    return new Promise((resolve, reject) => {
        if (labelArray.length === 0) {
            resolve(false)
            return
        }
        let sql = `INSERT INTO article_label(article_id,label_id,create_time,deleted) VALUE `
        for (let i = 0; i < labelArray.length; i++) {
            sql += `(${article_id},${labelArray[i]},'${dayjs().format('YYYY-MM-DD')}',0),`
        }
        sql = sql.replace(/,$/, '')
        connection.execute(sql).then(res => {
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
        const sql = `update article ${recombineUpdate(data, ['article_id', 'label'])} where article_id = ${data.article_id}`
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

// 更新文章标签中间表
async function updateLabel(data) {
    const sql = `update article_label set deleted = 1 where article_id = ${data.article_id}`
    try {
        // 删除文章之前标签数据
        await connection.execute(sql)
        // 重新插入文章标签数据
        await insertLabel(data.article_id, data.label)
        return Promise.resolve(true)
    } catch (e) {
        return Promise.reject(e)
    }
}


// 查询文章
function getArticleDetail(id) {
    return new Promise((resolve, reject) => {
        const sql = `select a.article_id,a.name,group_concat(al.label_id) as label,a.cover,a.summary,a.content 
                     from article a,article_label al 
                     where a.article_id = ${id} 
                     and a.deleted = 0 
                     and al.deleted = 0 
                     group  by a.article_id
                     `
        connection.query(sql).then(res => {
            if (!res && res.length === 0) {
                resolve(false)
            } else {
                const detail = res[0][0]
                // group_concat合并数据后会变成字符串形式，需要重新转成Number类型
                detail.label = detail.label.split(',').map(item => Number(item))
                resolve(detail)
            }
        }).catch(e => {
            reject(e)
        })
    })
}

// 获取文章列表
/**
 * 获取文章列表
 * 注：这是一条sql语句实现的方法
 * @param pageNum
 * @param pageSize
 * @param data
 * @returns {Promise<unknown>}
 */
function getArticleList(pageNum, pageSize, data) {
    return new Promise((resolve, reject) => {
        let sql = `select a.article_id,a.name,group_concat(l.name) as label,a.cover,a.summary,a.content
                   from article a,article_label al, label l
                   where a.article_id = al.article_id 
                   and al.label_id = l.label_id 
                   and a.deleted = 0
                   and a.article_id >=(select a.article_id from article a,article_label al where a.article_id = al.article_id group by article_id limit ${pageNum},1)
                  `
        // 存在搜索条件：文章名
        if (data.name) {
            sql += ` and a.name regexp '${data.name}'`
        }
        // 存在搜索条件：文章标签
        if (data.label) {
            sql += ` group by a.article_id 
                     having label regexp (select name from label where label_id = ${data.label}) 
                     limit ${pageSize}
                   `
        } else {
            sql += ` group by a.article_id 
                     limit ${pageSize}
                   `
        }
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
function getArticleTotal(data) {
    return new Promise((resolve, reject) => {
        let sql = `select group_concat(l.label_id) as label_id,a.article_id,a.name 
                   from article a,article_label al, label l 
                   where a.article_id = al.article_id 
                   and al.label_id = l.label_id
                   and a.deleted = 0 
                  `
        // 存在搜索条件：文章名
        if (data.name) {
            sql += ` and a.name regexp '${data.name}'`
        }
        if (data.label) {
            sql += ` group by a.article_id 
                     having label_id regexp '${data.label}'
                   `
        } else {
            sql += ` group by a.article_id`
        }
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

// 获取文章标签
function getArticleLabel() {
    return new Promise((resolve, reject) => {
        connection.query('select name as label,label_id as value from label order by label_id').then(res => {
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

// 删除文章
function delArticle(articleId) {
    return new Promise((resolve, reject) => {
        connection.execute(`update article set deleted = 1 where article_id =${articleId}`).then(res => {
            if (res[0].affectedRows > 0) {
                resolve(true)
            } else {
                resolve(false)
            }
        }).catch(e => {
            reject(e)
        })
    })
}

module.exports = {
    addArticle,
    updateArticle,
    insertLabel,
    updateLabel,
    getArticleDetail,
    getArticleList,
    getArticleTotal,
    getArticleLabel,
    delArticle,
}
