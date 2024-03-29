const path = require("path")

module.exports = {
    CODE_SUCCESS: 0,
    CODE_ERROR: -1,
    CODE_TOKEN_EXPIRED: -2,
    TOKEN_SECRET: 'baxuetuan.yangkang',
    JWT_EXPIRED: 60 * 60 * 2,
    SQL_STATEMENT_ERROR: 'SQL_STATEMENT_ERROR',
    SERVER_PORT: 3000,
    STATIC_PATH: path.join(__dirname, '../public/upload'),
}
