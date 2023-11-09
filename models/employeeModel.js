const mongoose = require("mongoose");

const employeeSchema = mongoose.Schema({
  salutation: {
    type: String,
    required: [true, "Please add the employee's salutation"],
  },
  firstName: {
    type: String,
    required: [true, "Please add the employee's first name"],
  },
  lastName: {
    type: String,
    required: [true, "Please add the employee's last name"],
  },
  email: {
    type: String,
    required: [true, "Please add the employee's email"],
  },
  phone: {
    type: Number,
    required: [true, "Please add the employee's phone number"],
  },
  dob: {
    type: String,
    required: [true, "Please add the employee's date of birth"],
  },
  gender: {
    type: String,
    required: [true, "Please add the employee's gender"],
  },
  qualifications: {
    type: String,
    required: [true, "Please add the employee's qualifications"],
  },
  address: {
    type: String,
    required: [true, "Please add the employee's address"],
  },
  country: {
    type: String,
    required: [true, "Please add the employee's country"],
  },
  state: {
    type: String,
    required: [true, "Please add the employee's state"],
  },
  city: {
    type: String,
    required: [true, "Please add the employee's city"],
  },
  pin: {
    type: Number,
    required: [true, "Please add the employee's pin"],
  },
  username: {
    type: String,
    required: [true, "Please add the employee's username"],
  },
  password: {
    type: String,
    required: [true, "Please add the employee's password"],
  },
  image : {
    type : String,
    required: true,
  },
},
{
    timestamps: true,
}
);

 const collection = mongoose.model("employee", employeeSchema);
 module.exports = collection;
