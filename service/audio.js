const connection = require('../db')

function createAudio(data) {
    return new Promise((resolve, reject) => {
        connection.execute('INSERT INTO audio (name, singer, url, create_time, deleted) VALUES(?,?,?,?,?)', data).then(res => {
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

function getAudioList(pageNum, pageSize, data) {
    return new Promise((resolve, reject) => {
        let sql = `select audio_id, name, singer, url, create_time from audio 
                    where deleted = 0
                    and audio_id >= (select audio_id from audio limit ${pageNum},1)
                  `
        if (data.name) {
            sql += ` and name = '${data.name}'`
        }
        sql += `limit ${pageSize}`

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

function getAudioTotal(data) {
    return new Promise((resolve, reject) => {
        let sql = `select name, singer, url,create_time from audio where deleted = 0`
        if (data.name) {
            sql += ` and name = '${data.name}'`
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

function delAudio(audio_id) {
    return new Promise((resolve, reject) => {
        connection.execute(`update audio set deleted = 1 where audio_id =${audio_id}`).then(res => {
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
    createAudio,
    getAudioList,
    getAudioTotal,
    delAudio
}
