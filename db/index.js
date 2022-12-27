const {
    host,
    port,
    database,
    user,
    password
} = require('./config')
const mysql = require('mysql2')

const connections = mysql.createPool({ // 创建连接池
    host,      // 主机地址
    port,     // 数据库端口号
    database, // 数据库名
    user,     // mysql数据库等登录名
    password  //密码
})

connections.getConnection((err, conn) => {
    conn.connect((err) => {
        if (err) {
            console.log("连接失败：", err)
        } else {
            console.log("数据库连接成功！")
        }
    })
})

module.exports = connections.promise()
