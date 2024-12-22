var express = require('express');
var router = express.Router();
var models = require('../models');
var crypto = require('crypto');

var ProductsAPI = "http://backend.restapi.co.za/items/products";

router.post("/", async (req, res) => {
/*  #swagger.tags = ['Initialize Database']
    #swagger.description = "Populate the database with initial roles, memberships, products, and an admin user."
    #swagger.responses[200] = {
      description: "Database initialized successfully.",
      schema: {
        status: "success",
        statuscode: 200,
        data: { 
          result: "Successfully initialized the Database." 
        }
      }
    }
    #swagger.responses[500] = {
      description: "Failed to initialize the database.",
      schema: {
        status: "error",
        statuscode: 500,
        data: { 
          result: "Error initializing the database." 
        }
      }
    }
*/
  try {
    const apiResponse = await fetch(ProductsAPI);
    if (!apiResponse.ok) {
      return res.status(500).json({
        status: "error",
        statuscode: 500,
        data: {
          result: "Failed fetching ProductsAPI",
        },
      });
    }

    const responseData = await apiResponse.json();
    const products = responseData.data;

    (async () => {
      const salt = crypto.randomBytes(16);

      await models.Role.create({ Id: 1, Name: "Admin" });
      await models.Role.create({ Id: 2, Name: "User" });

      const adminPassword = "P@ssword2023";
      const hashedAdminPassword = crypto.pbkdf2Sync(adminPassword, salt, 310000, 32, "sha256");

      await models.User.create({
        Username: "Admin",
        Password: hashedAdminPassword,
        Salt: salt,
        Email: "admin@noroff.no",
        FirstName: "Admin",
        LastName: "Support",
        Address: "Online",
        Phone: "911",
        RoleId: 1,
      });
    })();

    await models.Membership.create({
      Name: "Bronze",
      FromTotalPurchases: 0,
      ToTotalPurchases: 15,
      Discount: 0,
    });
    await models.Membership.create({
      Name: "Silver",
      FromTotalPurchases: 15,
      ToTotalPurchases: 30,
      Discount: 15,
    });
    await models.Membership.create({
      Name: "Gold",
      FromTotalPurchases: 30,
      ToTotalPurchases: 45,
      Discount: 30,
    });

    for (const product of products) {
      let category = await models.Category.findOne({ where: { Name: product.category } });
      if (!category) {
        category = await models.Category.create({ Name: product.category });
      }
    
      let brand = await models.Brand.findOne({ where: { Name: product.brand } });
      if (!brand) {
        brand = await models.Brand.create({ Name: product.brand });
      }

      await models.Product.create({
        CategoryId: category.Id,
        BrandId: brand.Id,
        ImageUrl: product.imgurl,
        Name: product.name,
        Description: product.description,
        Price: product.price,
        Quantity: product.quantity,
        Date_Added: product.date_added,
      });
    }

    res.status(200).json({
      status: "success",
      statuscode: 200,
      data: {
        result: "Successfully initialized the Database.",
      },
    });
  } catch (error) {
    console.error("Error initializing the database:", error);
    res.status(500).json({
      status: "error",
      statuscode: 500,
      data: {
        result: "Error initializing the database.",
      },
    });
  }
});

module.exports = router;