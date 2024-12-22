const express = require("express");
const router = express.Router();
const isAdmin = require("./isAdmin");

const BACKEND_API_URL = "http://localhost:3001";

router.get("/", isAdmin, async (req, res) => {
  try {
    const response = await fetch(`${BACKEND_API_URL}/products`);
    const data = await response.json();

    if (data.status === "success" && data.data.products) {
      const products = data.data.products;
      res.render("products", { products });
    } else {
      res.render("products", { products: [] });
    }
  } catch (error) {
    console.error("Error fetching products:", error.message);
    res.render("products", { products: [] });
  }
});

router.get("/get-token", (req, res) => {
  if (req.session.token) {
    res.json({ token: req.session.token });
  } else {
    res.status(401).json({ message: "No token found. Please log in again." });
  }
});

module.exports = router;