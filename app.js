const Koa = require('koa')
const KoaBody = require('koa-body')
const KoaStatic = require("koa-static")
const KoaCors = require("koa2-cors")
const koaParameter = require("koa-parameter")
const koaJwt = require("koa-jwt")
const app = new Koa()
const useRoutes = require('./routers/index')
const path = require("path")
const {
    TOKEN_SECRET,
    SERVER_PORT
} = require('./utils/constant')

const Result = require('./model/Result')


// 静态资源服务，指定对外提供访问的根目录
app.use(KoaStatic(path.join(__dirname, 'public')))

// 跨域中间件
app.use(KoaCors())

// 参数校验
app.use(koaParameter(app))

// token失效401处理
app.use(function (ctx, next) {
    return next().catch((err) => {
        if (401 == err.status) {
            ctx.status = 401;
            if (!ctx.header.authorization || ctx.header.authorization.indexOf('Bearer ') == -1) {
                ctx.body = new Result(null, '未携带token').jwtError();
            } else {
                ctx.body = new Result(null, 'token过期').jwtError();
            }
        } else {
            throw err;
        }
    });
});

// token校验
app.use(koaJwt({
    secret: TOKEN_SECRET,
}).unless({
    path: ['/', '/users/login']
}))

// 上传中间件
app.use(KoaBody({
    multipart: true,
    encoding: 'gzip',
    formidable: {
        maxFileSize: 5 * 1024 * 1024, // 设置上传文件大小最大限制，默认5M
        uploadDir: path.join(__dirname, "public/upload"), //设置文件上传的目录
        keepExtensions: true, // 保留文件扩展名
    }
}))

// 批量路由注册
useRoutes(app)

app.listen(SERVER_PORT, () => {
    console.log('服务启动了')
})
