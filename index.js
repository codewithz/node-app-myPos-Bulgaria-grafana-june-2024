const express=require("express")
const responseTime=require("response-time")
const client=require("prom-client"); //Metric Collection
const {doSomeHeavyTask} =require("./util")


const app=express()
const PORT=process.env.PORT || 8080;

const collectDefaultMetrics=client.collectDefaultMetrics;
collectDefaultMetrics({register:client.register})

const reqResTime=new client.Histogram({
    name:'http_express_request_response_time',
    help:'This parameters tells us how much time is taken by request and response',
    labelNames: ['method','route','status_code'],
    buckets: [1,50,100,200,400,500,800,1000,2000]
});

app.use(responseTime((req,res,time)=>{
    reqResTime.labels({
        method:req.method,
        route:req.url,
        status_code:res.statusCode
    }).observe(time)
}))


app.get("/",(req,res)=>{
    return res.json({message:'Hello from Express Server'})
})

app.get("/slow",async (req,res)=>{
    try{
        const timeTaken=await doSomeHeavyTask();
        return res.json({
            status:"Success",
            message:`Heavy Task completed in ${timeTaken} ms`
        })
    }
    catch(error){
        return res
                .status(500)
                .json({status:'Error',error:'Internal Server Error'})
    }
})

app.get("/metrics",async(req,res)=>{
    res.setHeader("Content-Type",client.register.contentType);
    const metrics=await client.register.metrics();
    res.send(metrics)
})


app.listen(PORT,()=>{
    console.log(`Express Server started at http://localhost:${PORT}`)
});
