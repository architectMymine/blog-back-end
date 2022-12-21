const connection = require('../db')

function findUser(username, password) {
    return connection.query(`select userId as id, name, password from users where name= '${username}' and password = '${password}'`)
}

function insertUser(username) {
    return connection.execute()
}


module.exports = {
    findUser,
    insertUser
}
