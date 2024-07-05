const mongoose=require("mongoose")


const PerformanceSchema= new mongoose.Schema({
    employeeId:{type:mongoose.Schema.Types.ObjectId,required:true,ref:"User"},
    feedback:{type:"String"},
    ratings:{type:"Number",required:true,min:1,max:5}
})

module.exports=mongoose.model("Performance",PerformanceSchema)