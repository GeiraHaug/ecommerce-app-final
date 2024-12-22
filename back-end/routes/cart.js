require('dotenv').config();
var express = require('express');
var router = express.Router();
var models = require('../models');
var authMiddleware = require('./authMiddleware');
var CartService = require('../services/CartService');
var cartService = new CartService(models);

router.get('/', authMiddleware.checkHeaderForToken, async (req, res) => {
/*  #swagger.tags = ['Cart']
    #swagger.description = "Retrieve the user's cart."
    #swagger.responses[200] = {
      description: "Cart retrieved successfully.",
      schema: {
        status: 'success',
        statuscode: 200,
        data: {
          result: "Cart retrieved successfully.",
          cart: {
            id: 1,
            userId: 1,
            items: [{ 
              productId: 1, 
              name: "Product A", 
              quantity: 2, 
              price: 99.99 
            }]
          }
        }
      }
    }
    #swagger.responses[500] = {
      description: "Failed to retrieve cart.",
      schema: {
        status: 'error',
        statuscode: 500,
        data: { result: "Failed to retrieve cart." }
      }
    }
  */
  try {
    const cart = await cartService.getCart(req.user.userId);
    res.status(200).json({
      status: 'success',
      statuscode: 200,
      data: {
        result: 'Cart retrieved successfully.',
        cart: cart,
      },
    });
  } catch (error) {
    console.error('Error retrieving cart:', error);
    res.status(500).json({
      status: 'error',
      statuscode: 500,
      data: {
        result: 'Failed to retrieve cart.',
      },
    });
  }
});

router.post('/', authMiddleware.checkHeaderForToken, async (req, res) => {
/*  #swagger.tags = ['Cart']
    #swagger.description = "Add a product to the user's cart."
    #swagger.parameters['body'] = {
      in: 'body',
      description: "Product ID and quantity to add to the cart.",
      required: true,
      schema: {
        productId: 1,
        quantity: 2
      }
    }
    #swagger.responses[200] = {
      description: "Product added to cart successfully.",
      schema: {
        status: 'success',
        statuscode: 200,
        data: { result: "Product added to cart successfully." }
      }
    }
    #swagger.responses[400] = {
      description: "Failed to add product to cart.",
      schema: {
        status: 'error',
        statuscode: 400,
        data: { result: "Error message describing the issue." }
      }
    }
  */
  const { productId, quantity } = req.body;
  try {
    await cartService.addToCart(req.user.userId, productId, quantity);
    res.status(200).json({
      status: 'success',
      statuscode: 200,
      data: {
        result: 'Product added to cart successfully.',
      },
    });
  } catch (error) {
    console.error('Error adding product to cart:', error);
    res.status(400).json({
      status: 'error',
      statuscode: 400,
      data: {
        result: error.message,
      },
    });
  }
});

router.post('/checkout/now', authMiddleware.checkHeaderForToken, async (req, res) => {
/*  #swagger.tags = ['Cart']
    #swagger.description = "Checkout the user's cart and place an order."
    #swagger.responses[200] = {
      description: "Cart checked out successfully.",
      schema: {
        status: 'success',
        statuscode: 200,
        data: {
          result: "Cart checked out successfully.",
          order: {
            orderId: 123,
            totalAmount: 299.97,
            items: [
              { productId: 1, 
                name: "Product A", 
                quantity: 2, 
                price: 99.99 }
            ]
          }
        }
      }
    }
    #swagger.responses[400] = {
      description: "Failed to checkout cart.",
      schema: {
        status: 'error',
        statuscode: 400,
        data: { result: "Error message describing the issue." }
      }
    }
*/
  try {
    const order = await cartService.checkoutCart(req.user.userId);
    res.status(200).json({
      status: 'success',
      statuscode: 200,
      data: {
        result: 'Cart checked out successfully.',
        order: order,
      },
    });
  } catch (error) {
    console.error('Error checking out cart:', error);
    res.status(400).json({
      status: 'error',
      statuscode: 400,
      data: {
        result: error.message,
      },
    });
  }
});

module.exports = router;