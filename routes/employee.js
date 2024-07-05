const express = require("express")
const router = express.Router()
const Employee = require("../models/Employee")
const authMiddleware = require("../middleware/auth");
const checkrole = require("../middleware/role")
const multer = require("multer")
const cloudinary = require("../config/cloudinary")
require("dotenv").config();

// Multer configuration
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Create a new employee
router.post("/employee", authMiddleware, checkrole(["admin"]), upload.array("media"), async (req, res) => {

  const { employeename, email, address, phonenumber, dateofbirth, designation, department, dateofjoining } = req.body;
  try {
    // Upload media files to Cloudinary
    const mediaUrls = await Promise.all(
      req.files.map(async (file) => {
        return new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              resource_type: "auto",
            },
            (error, result) => {
              if (error) return reject(error);
              resolve(result.secure_url);
            }
          );
          uploadStream.end(file.buffer);
        });
      })
    );
    const newEmployee = new Employee({
      employeename, email, address, phonenumber, dateofbirth, designation, department, dateofjoining,
      image: mediaUrls.filter(
        (url) => url.endsWith(".jpg") || url.endsWith(".png")
      ),
      user: req.userId,
    });
    console.log(newEmployee)
    await newEmployee.save();
    res.json({ message: "Employee details added sucessfully", employee: newEmployee });
  } catch (error) {
    res.json({ message: error.message });
  }
}
);

// Get all employees
router.get("/employee", authMiddleware, checkrole(["admin", "employee"]), async (req, res) => {
  try {

    const employees = await Employee.find({ active: true });

    res.json(employees);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

// Get a specific employee by ID
router.get("/employee/:employeeId", authMiddleware, checkrole(["admin", "employee"]), async (req, res) => {
  try {

    const employee = await Employee.findById(req.params.employeeId);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json(employee);
    console.log(employee)
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update an employee by ID
router.put("/employee/:employeeId", authMiddleware, checkrole(["admin"]), async (req, res) => {
  try {
    const updates = req.body
    const { employeeId } = req.params
    console.log(req.params)
    const employee = await Employee.findByIdAndUpdate(employeeId, updates);

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete an employee by ID
router.delete("/employee/:employeeId", authMiddleware, checkrole(["admin"]), async (req, res) => {
  try {

    // const {employeeId}=req.params
    const employee = await Employee.findByIdAndUpdate(req.params.employeeId, { active: false });

    console.log(employee)
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json({ message: "employee deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router