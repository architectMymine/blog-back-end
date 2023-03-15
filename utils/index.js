const { SQL_STATEMENT_ERROR } = require('./constant')
const fs = require('fs')

/**
 * 抛出SQL语句错误
 * @param ctx
 * @param error 捕获的错误
 */
function throwSqlError(ctx, error) {
    ctx.throw(500, SQL_STATEMENT_ERROR, {
        code: SQL_STATEMENT_ERROR,
        error
    });
}

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
 * @param {Array} target 目标数组
 * @returns {string} where条件语句
 */
function recombineSearch(data, target) {
    let keys = filterUnlessValue(data, target)
    // 组合条件
    let sql = 'where'
    if (keys.length > 0) {
        keys.map(key => {
            sql += ` ${key.prefix}.${key.tableName} regexp '${data[key.prop]}' and`
        })
        sql = sql.replace(/\s+and$/, '')
    } else {
        sql = ''
    }
    return sql
}

/**
 * 组合更新语句
 * @param {Object} data    数据源
 * @param {Object} exclude 剔除数据源
 * @returns {string} set语句
 */
function recombineUpdate(data, exclude) {
    let sql = 'set'
    Object.keys(data).forEach(item => {
        if (!exclude.includes(item)) {
            if (item === 'content') {
                // 将单引号全部替换为双引号
                data[item] = data[item].replace(/'/g, '"')
                sql += ` ${item} = '${data[item]}',`
            } else {
                sql += ` ${item} = '${data[item]}',`
            }
        }
    })
    return sql.replace(/,$/, '')
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
        if (data[key.prop] != null && data[key.prop] != '') keys.push(key)
    })
    return keys
}

async function isDirExists(dirpath) {
    return new Promise((resolve, reject) => {
        if(!fs.existsSync(dirpath)) {
            createDir(dirpath).then(res=>{
                if (res) {
                    resolve(res);
                } else {
                    reject(res);
                }
            })
        }else {
            resolve(true)
        }
    })
}

async function createDir(dirpath) {
    return new Promise((resolve, reject) => {
        fs.mkdir(dirpath,err => {
            if(err){
                reject(err)
            }else {
                resolve(true)
            }
        })
    })
}

async function deleteFile(filePath) {
    return new Promise((resolve, reject) => {
        fs.unlink(filePath,(err)=>{
            if(err){
                reject(err)
            }else {
                resolve(true)
            }
        })
    })
}

module.exports = {
    throwSqlError,
    parsePostData,
    recombineSearch,
    recombineUpdate,
    isDirExists,
    deleteFile,
}
