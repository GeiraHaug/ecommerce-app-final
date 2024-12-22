var express = require("express");
var router = express.Router();
var isAdmin = require("./isAdmin");

const BACKEND_API_URL = "http://localhost:3001";


router.get("/", isAdmin, async (req, res) => {
  try {
    const response = await fetch(`${BACKEND_API_URL}/categories`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${req.session.token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }

    const categoriesData = await response.json();
    const categories = categoriesData.data.categories;
    res.render("categories", { categories });
  } catch (error) {
    console.error("Error fetching categories:", error.message);
    res.render("categories", {
      categories: [],
      error: "Failed to load categories.",
    });
  }
});

module.exports = router;