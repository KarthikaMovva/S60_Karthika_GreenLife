const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { check, validationResult } = require("express-validator");
const { UsersModel } = require("../mongoConnect");

const UserRoutes = express.Router();
dotenv.config();

const validationRules = [
  check("UserName", "Username is required").not().isEmpty(),
  check("Gmail", "Email is not valid").isEmail(),
  check("Password", "Enter password of 5 or more characters").isLength({ min: 5 }),
  check("role", "Role is required").not().isEmpty(),
];

const loginValidationRules = [
  check("Gmail", "Enter valid email").isEmail(),
  check("Password", "Password is required").exists(),
];

// ================= SIGNUP =================
UserRoutes.post("/postuser", validationRules, async (req, res) => {
  const { UserName, Gmail, Password, role } = req.body;

  try {
    let user = await UsersModel.findOne({ Gmail });

    const hashedPassword = await bcrypt.hash(Password, 10);

    if (user) {
      // Update existing user
      user.role = role;
      user.Password = hashedPassword;
      await user.save();
    } else {
      // Create new user
      user = new UsersModel({
        UserName,
        Gmail,
        Password: hashedPassword,
        role,
      });

      await user.save();
    }

    const payload = { id: user.id, role: user.role };

    const token = jwt.sign(
      payload,
      process.env.Secret_key,
      { expiresIn: "1h" }
    );

    res.json({ token });

  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json("Server error");
  }
});

// ================= LOGIN =================
UserRoutes.post("/login", loginValidationRules, async (req, res) => {
  const validationError = validationResult(req);
  if (!validationError.isEmpty()) {
    return res.status(400).json({ errors: validationError.array() });
  }

  const { Gmail, Password } = req.body;

  try {
    const validUser = await UsersModel.findOne({ Gmail });
    if (!validUser) {
      return res.status(400).json({ message: "User not found" });
    }

    const correctPassword = await bcrypt.compare(
      Password,
      validUser.Password
    );

    if (!correctPassword) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    const payload = { id: validUser.id, role: validUser.role };

    const jwtToken = jwt.sign(
      payload,
      process.env.Secret_key,
      { expiresIn: "1h" }
    );

    res.json({ jwtToken });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json("Server error");
  }
});

// ================= GET USER =================
UserRoutes.get("/:id", async (req, res) => {
  try {
    const user = await UsersModel.findById(req.params.id).select("-Password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      username: user.UserName,
      gmail: user.Gmail,
      role: user.role,
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = UserRoutes;