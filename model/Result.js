const {
    CODE_SUCCESS,
    CODE_ERROR,
    CODE_TOKEN_EXPIRED
}  = require('../utils/constant')

class Result {
    constructor(data, message) {
        this.data = null
        if(arguments.length === 0) {
            this.message = '操作成功'
        }else {
            this.data = data
            this.message = message
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
            message: this.message
        }
        this.data && (base.data = this.data)
        return base
    }
}

module.exports = Result
