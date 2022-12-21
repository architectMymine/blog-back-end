const {
    CODE_SUCCESS,
    CODE_ERROR,
    CODE_TOKEN_EXPIRED
}  = require('../utils/constant')

class Result {
    constructor(data, msg) {
        this.data = null
        if(arguments.length === 0) {
            this.msg = '操作成功'
        }else {
            this.data = data
            this.msg = msg
        }
    }
    success() {
        this.code = CODE_SUCCESS
        return this.result()
    }
    error() {
        this.code = CODE_ERROR
        return this.result()
    }
    jwtError() {
        this.code = CODE_TOKEN_EXPIRED
        return this.result()
    }
    result() {
        const base = {
            code: this.code,
            msg: this.msg
        }
        this.data && (base.data = this.data)
        return base
    }
}

module.exports = Result
