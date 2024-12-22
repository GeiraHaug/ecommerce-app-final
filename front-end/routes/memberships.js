var express = require("express");
var router = express.Router();
var isAdmin = require("./isAdmin");

var BACKEND_API_URL = "http://localhost:3001";

router.get("/", isAdmin, async (req, res) => {
  try {
    const response = await fetch(`${BACKEND_API_URL}/memberships`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${req.session.token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch memberships");
    }

    const membershipsData = await response.json();
    const memberships = membershipsData.data.memberships;
    res.render("memberships", { memberships, token: req.session.token });
  } catch (error) {
    console.error("Error fetching memberships:", error.message);
    res.render("memberships", {
      memberships: [],
      error: "Failed to load memberships.",
      token: req.session.token,
    });
  }
});

module.exports = router;