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
                if (postdata.length > 0) {
                    resolve(JSON.parse(postdata))
                } else {
                    resolve({})
                }
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
    let keys = filterUnlessValue(data, target)
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

/**
 * 组合更新语句
 * @param {Object} data  数据源
 * @returns {string} set语句
 */
function recombineUpdate(data) {
    let sql = 'set'
    Object.keys(data).forEach(item => {
        if (item !== 'articleId') {
            sql += ` ${item} = ${data[item]},`
        }
    })
    sql.replace(/,$/, '')
    return sql
}

/**
 * 过滤空值属性
 * @param {Object} data  数据源
 * @param {Array<string>} target 目标数组
 * @returns {Array} 键数组
 */
function filterUnlessValue(data, target) {
    let keys = []
    target.map(key => {
        if (data[key] != null && data[key] != '') keys.push(key)
    })
    return keys
}

module.exports = {
    parsePostData,
    recombineSearch,
    recombineUpdate
}
