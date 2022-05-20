const Router = require('koa-router')
const router = Router()

const userRoute = require('./users.js')

// user模块
router.use("/users",userRoute)


module.exports = router;