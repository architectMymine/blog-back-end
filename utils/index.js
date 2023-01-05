/**
 * 解析对象数据
 * @param ctx
 * @returns {Promise<unknown>}
 */
function parsePostData(ctx) {
    return new Promise((resolve, reject) => {
        try {
            let postdata = ""
            ctx.req.on('data', (data) => {
                postdata += data
            })
            ctx.req.addListener("end", function () {
                resolve(JSON.parse(postdata))
            })
        } catch (error) {
            reject(error)
        }
    })
}

/**
 * 组合搜索语句
 * @param {Object} data  数据源
 * @param {Array<string>} target 目标数组
 * @returns {string} where条件语句
 */
function recombineSearch(data, target) {
    let keys = []
    // 剔除空值、null、undefined
    target.map(key => {
        if (data[key] != null && data[key] != '') keys.push(key)
    })
    // 组合where条件
    let sql = `where`
    if (keys.length > 0) {
        keys.map(key => {
            sql += ` ${key} regexp '${data[key]}' and`
        })
        sql = sql.replace(/\s+and$/, '')
    } else {
        sql = ''
    }
    return sql
}

module.exports = {
    parsePostData,
    recombineSearch
}
