require('dotenv').config();
var express = require('express');
var router = express.Router();
var models = require('../models');
var sequelize = models.sequelize;

router.post('/', async (req, res) => {
/*  #swagger.tags = ['Search']
    #swagger.description = "Search for products by name, brand or category. At least one search parameter is required."
    #swagger.parameters['body'] = {
      in: "body",
      description: "Search parameters (searchField, categoryName, brandName) for filtering products.",
      required: true,
      schema: {
        $searchField: "Iphone",
      }
    }
    #swagger.responses[200] = {
      description: "Successfully completed search.",
      schema: {
        status: "success",
        statuscode: 200,
        data: {
          result: "Successfully completed search.",
          totalRecords: 2,
          items: [
            {
              id: 1,
              name: "Example Product",
              description: "Example description",
              price: 89.99,
              quantity: 10,
              CategoryName: "Example Category",
              BrandName: "Example Brand",
              imageUrl: "http://example.com/product-image.png"
            },
            {
              id: 2,
              name: "Another Product",
              description: "Another description",
              price: 39.99,
              quantity: 7,
              CategoryName: "Another Category",
              BrandName: "Another Brand",
              imageUrl: "http://example.com/another-image.png"
            }
          ]
        }
      }
    }
    #swagger.responses[400] = {
      description: "Bad request. No search parameters provided.",
      schema: {
        status: "error",
        statuscode: 400,
        data: {
          result: "At least one search parameter is required."
        }
      }
    }
    #swagger.responses[500] = {
      description: "Server error during search.",
      schema: {
        status: "error",
        statuscode: 500,
        data: {
          result: "Failed to search."
        }
      }
    }
*/
  const { searchField, categoryName, brandName } = req.body;

  if (!searchField && !categoryName && !brandName) {
    return res.status(400).json({
      status: 'error',
      statuscode: 400,
      data: {
        result: 'At least one search parameter is required.',
      },
    });
  }

  try {
    let searchQuery = `
      SELECT p.*, 
      c.Name AS CategoryName, 
      b.Name AS BrandName 
      FROM Products p
      LEFT JOIN Categories c ON p.CategoryId = c.Id
      LEFT JOIN Brands b ON p.BrandId = b.Id
      WHERE 1=1
    `;
    const queryParameters = {};

    if (searchField) {
      searchQuery += ` AND p.Name LIKE :searchField`;
      queryParameters.searchField = `%${searchField}%`;
    }

    if (categoryName) {
      searchQuery += ` AND c.Name = :categoryName`;
      queryParameters.categoryName = categoryName;
    }

    if (brandName) {
      searchQuery += ` AND b.Name = :brandName`;
      queryParameters.brandName = brandName;
    }

    const products = await sequelize.query(searchQuery, {
      replacements: queryParameters,
      type: sequelize.QueryTypes.SELECT,
    });

    res.status(200).json({
      status: 'success',
      statuscode: 200,
      data: {
        result: 'Successfully completed search.',
        totalRecords: products.length,
        items: products,
      },
    });
  } catch (error) {
    console.error('Error during search:', error);
    res.status(500).json({
      status: 'error',
      statuscode: 500,
      data: {
        result: 'Failed to execute search.',
      },
    });
  }
});

module.exports = router;