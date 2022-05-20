const config  = require('./config')
const mysql = require('mysql2')

const connections = mysql.createPool({ // 创建连接池
    host: config.host, // 主机地址
    port: config.port, // 数据库端口号
    database: config.database, // 数据库名
    user: config.user, // mysql数据库等登录名
    password: config.password //密码
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