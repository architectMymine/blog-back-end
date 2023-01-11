const axios = require('axios')

let request = axios.create({
    timeout: 6000,
    headers: {
        'Content-Type': 'application/json;charset:utf-8;',
    }
})

// 返回拦截器
request.interceptors.response.use((res) => {
    return res.data
})


// http://sentence.iciba.com/index.php?c=dailysentence&m=getdetail&title=2020-04-24

function getDailySentence(date) {
    return request({
        url: 'http://sentence.iciba.com/index.php',
        method: "GET",
        params: {
            c: 'dailysentence',
            m: 'getdetail',
            title: date,
        }
    })
}


module.exports = {
    getDailySentence
}
