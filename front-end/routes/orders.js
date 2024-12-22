var express = require("express");
var router = express.Router();
var isAdmin = require("./isAdmin");

const BACKEND_API_URL = "http://localhost:3001";

router.get("/", isAdmin, async (req, res) => {
    try {
      const response = await fetch(`${BACKEND_API_URL}/orders/admin`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${req.session.token}`,
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }
  
      const ordersData = await response.json();
      const orders = ordersData.data.orders;
  
      res.render("orders", { 
        orders, 
        token: req.session.token,
        error: null 
      });
    } catch (error) {
      console.error("Error fetching orders:", error.message);
      res.render("orders", {
        orders: [],
        token: req.session.token,
        error: "Failed to load orders."
      });
    }
  });

module.exports = router;