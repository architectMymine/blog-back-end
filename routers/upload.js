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

router.post("/", (ctx) => {
    const files = ctx.request.files.files
    let result = ''
    let list = null
    try {
        if (Array.isArray(files)) {
            list = files.map(item => {
                const filesPath = singleFiles(item)
                return {
                    fileName: item.originalFilename,
                    url: `${ctx.origin}/upload/${filesPath}`
                }
            })
        } else {
            const filesPath = singleFiles(files)
            list = {
                fileName: files.originalFilename,
                url: `${ctx.origin}/upload/${filesPath}`
            }
        }
        result = new Result(list, '上传成功').success()
    } catch (e) {
        result = new Result('接口错误').error()
    }

    ctx.body = result
});

/**
 * 流程：
 * 1、检测有没有今天日期的文件夹
 * 2、读取上传文件的内容，并将文件添加到今天日期的文件夹中
 * 3、删除原来上传的文件
 * @param file
 */
function singleFiles(file) {
    const today = dayjs().format('YYYYMMDD')
    const dirPath = path.join(STATIC_PATH, `/${today}`)
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
