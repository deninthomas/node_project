const asyncHandler = require("express-async-handler");
const Employee = require("../models/employeeModel");
const path = require("path");
const upload = require("../config/multerConfig");
const multer = require("multer");

// // Image upload
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/"); // Set the destination folder for uploaded files
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + "-" + file.originalname); // Set the file name for uploaded files
//   },
// });

//*****************************Get all employees***************************//


const getEmployees = asyncHandler(async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 5;
  const skip = (page - 1) * limit;

  const employees = await Employee.find();
  // .skip(skip).limit(limit);
  const pageEmployee = await Employee.find().skip(skip).limit(limit);

  res.status(200).json({
    message: "ok",
    length: employees.length,
    data: pageEmployee,
  });
});

// *********************************post employee********************************//

const createEmployee = asyncHandler(async (req, res) => {
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      res.status(400).json({ message: "Image upload error" });
    } else if (err) {
      res.status(500).json({ message: "Server error" });
    } else {
      const {
        salutation,
        firstName,
        lastName,
        email,
        phone,
        dob,
        gender,
        qualifications,
        address,
        country,
        state,
        city,
        pin,
        username,
        password,
      } = req.body;

      // Get uploaded file path from req.file
      const imagePath = req.file ? req.file.path : null;

      if (
        !salutation ||
        !firstName ||
        !lastName ||
        !email ||
        !phone ||
        !dob ||
        !gender ||
        !qualifications ||
        !address ||
        !country ||
        !state ||
        !city ||
        !pin ||
        !username ||
        !password
      ) {
        res.status(400);
        throw new Error("All fields are mandatory");
      }

      const employee = await Employee.create({
        salutation,
        firstName,
        lastName,
        email,
        phone,
        dob,
        gender,
        qualifications,
        address,
        country,
        state,
        city,
        pin,
        username,
        password,
        image: imagePath, // Set the image path to the database field
      });

      res.status(201).json(employee);
    }
  });
});


// *********************************get one employee********************************//

const getEmployee = asyncHandler(async (req, res) => {
  const employee = await Employee.findById(req.params.id);
  if (!employee) {
    res.status(404);
    throw new Error("Employee not found");
  }
  res.status(200).json(employee);
});


// *********************************edit employee********************************//

const updateEmployee = asyncHandler(async (req, res) => {
  // File upload middleware
  upload(req, res, async (error) => {
    if (error instanceof multer.MulterError) {
      return res
        .status(400)
        .json({ error: "Image upload error: " + error.message });
    } else if (error) {
      return res.status(500).json({ error: "Internal server error" });
    }

    let avatarPath;
    if (req.file) {
      avatarPath = path.join("uploads", req.file.filename);
    } else {
      // if file doesn't uploaded, keep the existing avatar path
      const emp = await Employee.findById(req.params.id);
      if (!emp) {
        res.status(404).json({ error: "employee not found" });
        return;
      }
      avatarPath = emp.image; // Use the existing avatar path
    }

    // Update avatar only if a new file was uploaded
    const updateData = {
      ...req.body,
      ...(avatarPath ? { image: avatarPath } : {}), //condition to include image
    };
    console.log(avatarPath)
    const updatedData = await Employee.findByIdAndUpdate(req.params.id, updateData, {new: true});
    console.log(updatedData)
    res.status(200).json(updatedData);
  });

});

// *********************************delete employee********************************//

const deleteEmployee = asyncHandler(async (req, res) => {
  const employee = await Employee.findById(req.params.id);
  if (!employee) {
    res.status(404);
    throw new Error("Employee not found");
  }
  await Employee.findByIdAndDelete(req.params.id);
  res.status(200).json(employee);
});

//**************search************************/
const searchEmployee = asyncHandler(async (req, res) => {
  const query = req.query.q.toString();
  try {
    const items = await Employee.find({
      $or: [
        { firstName: { $regex: new RegExp(query, "i") } },
        { lastName: { $regex: new RegExp(query, "i") } },
        { email: { $regex: new RegExp(query, "i") } },
      ],
    });
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "internal server error" });
  }
});

module.exports = {
  getEmployees,
  createEmployee,
  getEmployee,
  updateEmployee,
  deleteEmployee,
  searchEmployee,
};
