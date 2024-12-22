const express = require("express");
const router = express.Router();

const BACKEND_API_URL = "http://localhost:3001";

router.post("/", async (req, res) => {
  const { searchField, categoryName, brandName } = req.body;

  if (!searchField && !categoryName && !brandName) {
    return res.status(400).json({
      status: "error",
      message: "At least one search parameter is required.",
    });
  }

  try {
    const response = await fetch(`${BACKEND_API_URL}/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ searchField, categoryName, brandName }),
    });

    const data = await response.json();

    if (data.status === "success") {
      res.render("products", { products: data.data.items });
    } else {
      res.render("products", { products: [] });
    }
  } catch (error) {
    console.error("Error during search:", error.message);
    res.render("products", { products: [] });
  }
});

module.exports = router;