## blog-back-end

#### 博客后端代码

#### mysql2的详细用法参考[这里](https://github.com/sidorares/node-mysql2/tree/master/documentation_zh-cn)

#### 目前koa-body只支持form-data的方式传递数据(因为要兼容上传文件),所以具体前端只传对象的话，需要自己用node的原生方法来监听，如下：

```javascript
let postdata = ""
ctx.req.on('data', (data) => {
    postdata += data
})
ctx.req.addListener("end", function () {
    resolve(JSON.parse(postdata))
})
```
具体可以参考```utils/index.js```里面的```parsePostData```函数的使用。
