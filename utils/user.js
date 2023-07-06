const {
    getUserInfo
} = require('../service/user')
const jwt = require('jsonwebtoken')
const {
    TOKEN_SECRET,
} = require('../utils/constant')

async function getUserDetail(ctx) {
    let token = ctx.header.authorization
    if (token.includes('Bearer ')) {
        token = token.replace('Bearer ', '')
    }
    // 解析token
    const decode = jwt.verify(token, TOKEN_SECRET)
    try {
        if (decode && decode.username) {
            const userInfo = await getUserInfo(decode.username)
            return userInfo
        } else {
            return null
        }
    } catch (e) {
        return null
    }
}


module.exports = {
    getUserDetail
}
