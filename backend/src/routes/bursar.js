const express = require("express");
const router = express.Router();

// Hardcoded bursar credentials
const bursarUser = {
  username: "bursar1",
  password: "1234",
  name: "Default Bursar"
};

// POST /api/bursar/login
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password required" });
  }

  if (username === bursarUser.username && password === bursarUser.password) {
    return res.json({
      message: "Login successful",
      user: {
        username: bursarUser.username,
        name: bursarUser.name
      }
    });
  }

  res.status(401).json({ error: "Invalid credentials" });
});

module.exports = router;
