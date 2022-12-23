const connection = require('../db')

function findUser(username, password) {
    return connection.query(`select userId as id, name, password from users where name= '${username}' and password = '${password}'`)
}

function getUserInfo(username) {
    return connection.query(`select userId as user_id,name ,avatar from users where name = '${username}'`)
}


module.exports = {
    findUser,
    getUserInfo
}
