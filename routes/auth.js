const express = require("express")
const router = express.Router()
const bcrypt = require("bcryptjs")
const User = require("../models/User")
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/auth");
const checkrole = require("../middleware/role")
//register
router.post("/register", async (req, res) => {
  try {
    const { username, email, password, role } = req.body
    const existingUser = await User.findOne({ email })
    if (existingUser)
      return res.json("Already registered please login")
    const hashedpassword = await bcrypt.hash(password, 10)
    const user = new User({ username, email, password: hashedpassword, role })
    await user.save()
    res.json("Registered Sucessfully")
  }
  catch (err) {
    res.json({ message: err.message })
  }

})
//login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.json("Invalid credentials")
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1hr" })
    res.json({ token: token, user: user })
  }
  catch (err) {
    res.json({ message: err.message })
  }

})

// Get all the users
router.get("/users", authMiddleware, checkrole(["admin", "employee",]), async (req, res) => {
  try {

    const user = await User.find({role:'employee'});
    res.json(user);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

// Get a specific user by ID
router.get("/user", authMiddleware, checkrole(["admin", "employee", 'applicant']), async (req, res) => {
  try {

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



module.exports = router