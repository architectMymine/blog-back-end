## blog-back-end
#### 博客后端代码

## koa怎么获取请求参数


#### 获取post请求参数
> 需要安装 koa-bodyparser 插件
```javascript
ctx.request.body
```

#### 获取动态路由参数
```javascript
router.get('/package/:aid/:cid',async (ctx)=>{
    //获取动态路由的传值
    console.log(ctx.params);  //{ aid: '123', cid: '456' }
    ctx.body="详情";
})
```

#### 获取get参数
```javascript
// url?color=blue&size=small
{
  color: 'blue',
  size: 'small'
}
```