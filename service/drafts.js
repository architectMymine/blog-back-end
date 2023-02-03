const connection = require('../db')
const dayjs = require('dayjs')
const { recombineUpdate } = require("../utils");

// 草稿文章列表
function getDarftsList() {
    return new Promise((resolve, reject)=>{
        connection.query('select drafts_id, name, label, cover, summary, content, create_time, update_time from article_drafts where deleted = 0').then(res=>{
            if (!res && res.length === 0) {
                resolve(false)
            } else {
                resolve(res[0])
            }
        }).catch(e=>{
            reject(e)
        })
    })

}

// 新增草稿文章
function createArticleDrafts(data) {
    return new Promise((resolve, reject) => {
        connection.execute('INSERT INTO article_drafts (drafts_id, name, label, cover, summary, content, create_time, update_time, deleted) VALUES (?,?,?,?,?,?,?,?,?)', data).then(res => {
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

// 查询草稿文章
function getDraftsDetail(id) {
    return new Promise((resolve, reject)=>{
        connection.query(`select * from article_drafts where id = ${id}`).then(res=>{
            if (!res && res.length === 0) {
                resolve(false)
            } else {
                const detail = res[0][0]
                if (detail.label !== '') {
                    detail.label = detail.label.split(',').map(item => Number(item))
                }
                resolve(detail)
            }
        })
    }).catch(e => {
        reject(e)
    })
}

// 更新草稿文章内容
function updateArticleDrafts(data) {
    return new Promise((resolve, reject) => {
        const sql = `update article_drafts 
                     ${recombineUpdate(data, ['drafts_id'])} 
                     ,update_time = '${dayjs().format('YYYY-MM-DD HH:mm:ss')}' 
                     where drafts_id = ${data.drafts_id}`
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

// 删除文章
function delArticleDrafts(draftsId) {
    return new Promise((resolve, reject) => {
        connection.execute(`update article_drafts set deleted = 1 where drafts_id =${draftsId}`).then(res => {
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
    getDarftsList,
    createArticleDrafts,
    updateArticleDrafts,
    getDraftsDetail,
    delArticleDrafts
}
