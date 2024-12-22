require('dotenv').config();
var express = require('express');
var router = express.Router();
var validator = require('validator');
var models = require('../models');
var authMiddleware = require('../routes/authMiddleware');
var ProductService = require('../services/ProductService');
var productService = new ProductService(models);

router.get('/', async (req, res) => {
/*  #swagger.tags = ['Products']
    #swagger.description = "Retrieve a list of all products, including their category and brand information."
    #swagger.responses[200] = {
      description: "List of products retrieved successfully.",
      schema: {
        status: "success",
        statuscode: 200,
        data: {
          result: "Products found",
          products: [
            {
              name: "Product Name",
              id: 1,
              description: "Product description",
              price: 99.99,
              date_added: "2024-01-01T11:11:11Z", 
              imageUrl: "http://example.com/image.png",                           
              quantity: 10,
              isDeleted: 0,
              createdAt: "2024-01-01T11:11:11Z",              
              BrandId: 1,
              CategoryId: 1,
              brand: "Example Brand",
              category: "Example Category"
            }
          ]
        }
      }
    }
    #swagger.responses[500] = {
      description: "Failed to fetch products.",
      schema: { 
        status: "error", 
        statuscode: 500, 
        data: { 
          result: "Failed to fetch products." 
        }
      }
    }
*/
  try {
    const products = await productService.getAllProducts();
    res.status(200).json({
      status: "success",
      statuscode: 200,
      data: { 
        result: "Products found", 
        products 
      }
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      status: "error",
      statuscode: 500,
      data: { 
        result: "Failed to fetch products." 
      },
    });
  }
   
});

router.post('/', authMiddleware.checkHeaderForToken, authMiddleware.isAdmin, async (req, res) => {
/*  #swagger.tags = ['Products']
    #swagger.description = "Allows admin users to create a new product."
    #swagger.parameters['body'] = {
      in: 'body',
      description: "Product details for creation.",
      required: true,
      schema: {
        name: "New Product",
        description: "Product description",
        price: 99.99,
        quantity: 10,
        imageUrl: "http://example.com/image.png",
        brandId: 1,
        categoryId: 1
      }
    }
    #swagger.responses[201] = {
      description: "Product created successfully.",
      schema: {
        status: "success",
        statuscode: 201,
        data: { 
          result: "Product created successfully.", 
          product: { id: 1, name: "New Product" }
        }
      }
    }
    #swagger.responses[400] = {
      description: "Validation error - Invalid product data.",
      schema: { 
        status: "error", 
        statuscode: 400, 
        data: { 
          result: "Validation error message." 
        }
      }
    }
    #swagger.responses[500] = {
      description: "Failed to create product.",
      schema: { 
        status: "error", 
        statuscode: 500, 
        data: { 
          result: "Failed to create product." 
        }
      }
    }
*/
  const { name, description, price, quantity, imageUrl, brandId, categoryId, date_added } = req.body;

  if (!validator.isNumeric(price.toString()) || price <= 0) {
    return res.status(400).json({
      status: "error",
      statuscode: 400,
      data: { 
        result: "Price must be a positive number." 
      },
    });
  }

  if (!validator.isInt(quantity.toString()) || quantity < 0) {
    return res.status(400).json({
      status: "error",
      statuscode: 400,
      data: { 
        result: "Quantity must be a non-negative integer." 
      },
    });
  }

  try {
    const newProduct = await productService.createProduct(name, description, price, quantity, imageUrl, brandId, categoryId, date_added);
    res.status(201).json({
      status: "success",
      statuscode: 201,
      data: { 
        result: "Product created successfully.", 
        product: newProduct 
      },
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({
      status: "error",
      statuscode: 500,
      data: { 
        result: "Failed to create product." 
      },
    });
  }
});

router.put('/:productId', authMiddleware.checkHeaderForToken, authMiddleware.isAdmin, async (req, res) => {
/*  #swagger.tags = ['Products']
    #swagger.description = "Allows admin users to update product details."
    #swagger.parameters['productId'] = {
      in: "path",
      description: "ID of the product to update.",
      required: true,
      type: "integer"
    }
    #swagger.parameters['body'] = {
      in: "body",
      description: "Updated product details.",
      required: true,
      schema: {
        name: "Updated Product",
        description: "Updated description",
        price: 199.99,
        quantity: 20,
        imageUrl: "http://example.com/new-image.png",
        brandId: 2,
        categoryId: 3
      }
    }
    #swagger.responses[200] = {
      description: "Product updated successfully.",
      schema: { 
        status: "success",
        statuscode: 200,
        data: { result: "Product updated successfully." }
      }
    }
    #swagger.responses[404] = {
      description: "Product not found.",
      schema: { 
        status: "error", 
        statuscode: 404, 
        data: { 
          result: "Product not found." 
        }
      }
    }
    #swagger.responses[500] = {
      description: "Failed to update product.",
      schema: { 
        status: "error", 
        statuscode: 500, 
        data: { 
          result: "Failed to update product." 
        }
      }
    }
*/
  const productId = req.params.productId;
  const { name, description, price, quantity, imageUrl, brandId, categoryId } = req.body;

  try {
    const updatedProduct = await productService.updateProduct(productId, name, description, price, quantity, imageUrl, brandId, categoryId);
    if (!updatedProduct) {
      return res.status(404).json({
        status: "error",
        statuscode: 404,
        data: { 
          result: "Product not found." 
        },
      });
    }

    res.status(200).json({
      status: "success",
      statuscode: 200,
      data: { 
        result: "Product updated successfully." 
      },
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({
      status: "error",
      statuscode: 500,
      data: { 
        result: "Failed to update product." 
      },
    });
  }
});

router.delete('/:productId', authMiddleware.checkHeaderForToken, authMiddleware.isAdmin, async (req, res) => {
/*  #swagger.tags = ['Products']
    #swagger.description = "Allows admin users to soft delete a product."
    #swagger.parameters['productId'] = {
      in: "path",
      description: "ID of the product to delete.",
      required: true,
      type: "integer"
    }
    #swagger.responses[200] = {
      description: "Product deleted successfully.",
      schema: {
        status: "success",
        statuscode: 200,
        data: { result: "Product deleted successfully." }
      }
    }
    #swagger.responses[404] = {
      description: "Product not found.",
      schema: { 
        status: "error", 
        statuscode: 404, 
        data: { 
          result: "Product not found." 
        }
      }
    }
    #swagger.responses[500] = {
      description: "Failed to delete product.",
      schema: { 
        status: "error", 
        statuscode: 500, 
        data: { 
          result: "Failed to delete product." 
        }
      }
    }
*/
  const productId = req.params.productId;

  try {
    const deleted = await productService.softDeleteProduct(productId);
    if (!deleted) {
      return res.status(404).json({
        status: "error",
        statuscode: 404,
        data: { 
          result: "Product not found." 
        },
      });
    }

    res.status(200).json({
      status: "success",
      statuscode: 200,
      data: { 
        result: "Product deleted successfully." 
      },
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({
      status: "error",
      statuscode: 500,
      data: { 
        result: "Failed to delete product." 
      },
    });
  }
});

module.exports = router;