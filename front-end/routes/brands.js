var express = require("express");
var router = express.Router();
var isAdmin = require("./isAdmin");

const BACKEND_API_URL = "http://localhost:3001";

router.get("/", isAdmin, async (req, res) => {
  try {
    const response = await fetch(`${BACKEND_API_URL}/brands`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${req.session.token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch brands");
    }

    const brandsData = await response.json();
    res.render("brands", { brands: brandsData.data.brands });
  } catch (error) {
    console.error("Error fetching brands:", error.message);
    res.render("brands", {
      brands: [],
      error: "Failed to load brands.",
    });
  }
});

module.exports = router;