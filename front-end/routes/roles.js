var express = require("express");
var router = express.Router();
var isAdmin = require("./isAdmin");

var BACKEND_API_URL = "http://localhost:3001";

router.get("/", isAdmin, async (req, res) => {
  try {
    const response = await fetch(`${BACKEND_API_URL}/roles`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${req.session.token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch roles");
    }

    const rolesData = await response.json();
    const roles = rolesData.data.roles;
    res.render("roles", { roles });
  } catch (error) {
    console.error("Error fetching roles:", error.message);
    res.render("roles", {
      roles: [],
      error: "Failed to load roles.",
    });
  }
});

module.exports = router;