

function parsePostData(ctx){
    return new Promise((resolve,reject)=>{
        try{
            let postdata=""
            ctx.req.on('data',(data)=>{
                postdata += data
            })
            ctx.req.addListener("end",function(){
                resolve(JSON.parse(postdata))
            })
        }catch(error){
            reject(error)
        }
    })
}


module.exports  =  {
    parsePostData
}
