const express=require("express")
const {doSomeHeavyTask} =require("./util")


const app=express()
const PORT=process.env.PORT || 8080;

app.get("/",(req,res)=>{
    return response.json({message:'Hello from Express Server'})
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


app.listen(PORT,()=>{
    console.log(`Express Server started at http://localhost:${PORT}`)
});
