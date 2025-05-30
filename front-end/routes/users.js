var express = require('express');
var router = express.Router();
var isAdmin = require("./isAdmin");

var BACKEND_API_URL = "http://localhost:3001";

router.get("/", isAdmin, async (req, res) => {
  try {
    const response = await fetch(`${BACKEND_API_URL}/users`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${req.session.token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }

    const usersData = await response.json();
    const users = usersData.data.users;
    res.render("users", { users });
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res.render("users", {
      users: [],
      error: "Failed to load users.",
    });
  }
});

module.exports = router;