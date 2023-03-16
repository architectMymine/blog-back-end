const Router = require('koa-router')
const router = new Router({ prefix: "/uploads" })
const Result = require('../model/Result')
const fs = require('fs')
const path = require("path")
const dayjs = require('dayjs')
const { isDirExists, deleteFile } = require('../utils/index')
const {
    STATIC_PATH,
} = require('../utils/constant')

// 图片上传接口
router.post("/picture", async (ctx) => {
    let result = ''
    try {
        const list = await commonUpload(ctx, 'picture')
        result = new Result(list, '上传成功').success()
    } catch (e) {
        result = new Result('接口错误').error()
    }

    ctx.body = result
});

// 音频上传接口
router.post('/audio', async (ctx) => {
    let result = ''
    try {
        const list = await commonUpload(ctx, 'audio')
        result = new Result(list, '上传成功').success()
    } catch (e) {
        result = new Result('接口错误').error()
    }
    ctx.body = result
})

// 上传通用逻辑
function commonUpload(ctx, dirname) {
    return new Promise((resolve) => {
        const files = ctx.request.files.files
        let list = null
        const static_path = path.join(STATIC_PATH, `./${dirname}`)
        isDirExists(static_path).then(res => {
            if (res) {
                if (Array.isArray(files)) {
                    list = files.map(item => {
                        const filesPath = singleFiles(item,dirname)
                        return {
                            fileName: item.originalFilename,
                            url: `${ctx.origin}/upload/${dirname}/${filesPath}`
                        }
                    })
                } else {
                    const filesPath = singleFiles(files,dirname)
                    list = {
                        fileName: files.originalFilename,
                        url: `${ctx.origin}/upload/${dirname}/${filesPath}`
                    }
                }
                resolve(list)
            }
        })
    })
}


/**
 * 流程：
 * 1、检测有没有今天日期的文件夹
 * 2、读取上传文件的内容，并将文件添加到今天日期的文件夹中
 * 3、删除原来上传的文件
 * @param file
 */
function singleFiles(file,dirname) {
    const today = dayjs().format('YYYYMMDD')
    const dirPath = path.join(STATIC_PATH, `/${dirname}/${today}`)
    const originFilePath = path.join(STATIC_PATH, `/${file.newFilename}`)
    isDirExists(dirPath).then(res => {
        if (res) {
            fs.readFile(originFilePath, (err, data) => {
                fs.appendFile(path.join(dirPath, `/${file.newFilename}`), data, err => {
                    if (err) {
                        console.log('err', err)
                    } else {
                        deleteFile(originFilePath)
                    }
                })

            })
        }
    })
    return `/${today}/${file.newFilename}`
}

module.exports = router;
