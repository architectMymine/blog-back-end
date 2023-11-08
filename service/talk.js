const connection = require('../db')
const {
    recombineUpdate
} = require('../utils/index')
const dayjs = require('dayjs')

// 获取说说列表
function getTalkList(pageNum, pageSize, data) {
    return new Promise((resolve, reject) => {
        let sql = `select ut.talk_id,ut.user_id,u.name as username,u.avatar,ut.content,ut.photo,ut.create_time,ut.update_time,ut.deleted
                    from users u,users_talk ut
                    where ut.user_id = u.userId
                    and ut.deleted = 0`
        if (data.name) {
            sql += ` and u.name = '${data.username}'`
        }
        sql += ` order by ut.create_time desc limit ${pageSize}`
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

// 获取说说总数
function getTalkTotal(data) {
    return new Promise((resolve, reject) => {
        let sql = `select ut.talk_id,ut.user_id,u.name as username,ut.content,ut.photo,ut.create_time,ut.update_time,ut.deleted
                    from users u,users_talk ut
                    where ut.user_id = u.userId
                    and ut.deleted = 0 `
        if (data.name) {
            sql += ` and u.name = '${data.username}'`
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

// 新增说说
function creatTalk(data) {
    return new Promise((resolve, reject) => {
        connection.execute('INSERT INTO users_talk(user_id, content, photo, create_time, update_time, deleted) VALUES(?,?,?,?,?,?)', data).then(res => {
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

// 修改说说
function alterTalk(data) {
    console.log('data', data)
    return new Promise((resolve, reject) => {
        const sql = `update users_talk
                     ${recombineSetSql(data, ['talk_id'])}   
                     update_time = '${dayjs().format('YYYY-MM-DD HH:mm:ss')}' 
                     where talk_id = ${data.talk_id}`
        connection.execute(sql).then(res => {
            console.log('res',res)
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

// 删除说说
function delTalk(talk_id) {
    return new Promise((resolve, reject) => {
        connection.execute(`update users_talk set deleted = 1 where talk_id =${talk_id}`).then(res => {
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

/**
 * 组合更新语句
 * @param {Object} data    数据源
 * @param {Array} exclude 剔除数据源
 * @returns {string} set语句
 */
function recombineSetSql(data, exclude) {
    let sql = 'set'
    Object.keys(data).forEach(key => {
        if (!exclude.includes((key))) {
            sql += ` ${key} = '${data[key]}',`
        }

    })
    return sql
}


module.exports = {
    getTalkList, getTalkTotal, creatTalk, alterTalk, delTalk
}

