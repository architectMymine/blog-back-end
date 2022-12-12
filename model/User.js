const connection = require('../db/index')
class User {
    constructor() {
        this.query = connection.query
        this.execute = connection.execute
    }
    findUser(username) {
       return  this.query(`select id as userId, name, age, sex, phone form user where name= ${username}`)
    }
    insertUser(username) {
        return this.execute()
    }
}
