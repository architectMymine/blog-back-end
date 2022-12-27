const connection = require('../db')

function findUser(username, password) {
    return connection.query(`select userId as id, name, password from users where name= '${username}' and password = '${password}'`)
}

function getUserInfo(username) {
    return new Promise((resolve, reject) => {
        connection.query(`select userId as user_id,name ,avatar from users where name = '${username}'`).then(userInfo => {
            if (!userInfo && userInfo.length === 0) {
                resolve(null)
            } else {
                resolve(userInfo[0][0])
            }
        }).catch(e => {
            reject(e)
        })
    })
}


module.exports = {
    findUser,
    getUserInfo
}
