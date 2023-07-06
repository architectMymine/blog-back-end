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
    STATIC_PATH,
    TOKEN_SECRET,
    SERVER_PORT,
    SQL_STATEMENT_ERROR
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
    // 路由访问异常拦截
    if (ctx.response.status === 404) {
        ctx.body = new Result('路由不存在').error()
    }
    return next().catch((err) => {
        /**
         * 这个错误是koa-jwt内部throw出来的错误，并且要在它注册之前拦截，官方教授的拦截方法，主要是不想用koa-jwt抛出的错误。
         * token失效401处理
         */
        if (err.status === 401) {
            ctx.status = 401;
            if (!ctx.header.authorization || ctx.header.authorization.indexOf('Bearer ') == -1) {
                ctx.body = new Result(null, '未携带token').jwtError();
            } else {
                ctx.body = new Result(null, 'token过期').jwtError();
            }
        } else if (err.status === 500 && err.code === SQL_STATEMENT_ERROR) {
            // 捕获sql语句错误，统一抛出
            ctx.body = new Result(err.error, '接口错误').error();
        } else {
            throw err;
        }
    });
});

// token校验
app.use(koaJwt({
    secret: TOKEN_SECRET,
}).unless({
    path: ['/',
        '/article/list',
        '/article/detail',
        '/article/label_with_article',
        '/users/login',
        '/audio/list',
        /^\/common\/*/,
        // /^\/uploads\/*/,
        '/talk/list',
    ]
}))


// 上传中间件
app.use(KoaBody({
    multipart: true,
    encoding: 'gzip',
    formidable: {
        maxFileSize: 5 * 1024 * 1024, // 设置上传文件大小最大限制，默认5M
        uploadDir: STATIC_PATH, //设置文件上传的目录
        keepExtensions: true, // 保留文件扩展名
    },


}))


// 批量路由注册
useRoutes(app)

app.listen(SERVER_PORT, () => {
    console.log('服务启动了', SERVER_PORT)
})

