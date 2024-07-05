const mongoose = require("mongoose")

const EmployeeSchema = new mongoose.Schema({
    employeename: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    phonenumber: { type: Number, required: true },
    dateofbirth: { type: String, required: true },
    designation: { type: String, required: true },
    department: { type: String, required: true },
    dateofjoining: { type: String, required: true },
    image: [String],
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    active: { type: Boolean, default: true }
    // type:Date,default:Date.now
},
    {
        timestamps: true
    })

module.exports = mongoose.model("Employee", EmployeeSchema)