const mongoose =require("mongoose");
const Schema = mongoose.Schema;

const OTPschema = new Schema({
    email:{ type:String, unique: true},
    otp: String,
    createdAt: Date,
    expiresAt: Date,
});

const OTP = mongoose.model("OTP", OTPschema );
module.exports = OTP;