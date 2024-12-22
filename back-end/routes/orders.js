require('dotenv').config();
var express = require('express');
var router = express.Router();
var models = require('../models');
var authMiddleware = require('./authMiddleware');
var OrderService = require('../services/OrderService');
var orderService = new OrderService(models);

router.get('/admin', authMiddleware.checkHeaderForToken, authMiddleware.isAdmin, async (req, res) => {
/*  #swagger.tags = ['Orders']
    #swagger.description = "Retrieve all orders for all users. Admin access is required."
    #swagger.responses[200] = {
      description: "Orders retrieved successfully.",
      schema: {
        status: "success",
        statuscode: 200,
        data: {
          result: "Orders retrieved successfully.",
          orders: [
            { id: 1, userId: 1, status: "Ordered", totalAmount: 100.50 }
          ]
        }
      }
    }
    #swagger.responses[500] = {
      description: "Failed to retrieve orders.",
      schema: { 
        status: "error", 
        statuscode: 500, 
        data: { 
          result: "Failed to retrieve orders." 
        }
      }
    }
*/
  try {
    const orders = await orderService.getAllOrders();
    res.status(200).json({
      status: 'success',
      statuscode: 200,
      data: {
        result: 'Orders retrieved successfully.',
        orders: orders,
      },
    });
  } catch (error) {
    console.error('Error retrieving orders for admin:', error);
    res.status(500).json({
      status: 'error',
      statuscode: 500,
      data: {
        result: 'Failed to retrieve orders.',
      },
    });
  }
});

router.get('/', authMiddleware.checkHeaderForToken, async (req, res) => {
/*  #swagger.tags = ['Orders']
    #swagger.description = "Retrieve all orders for the authenticated user."
    #swagger.responses[200] = {
      description: "User orders retrieved successfully.",
      schema: {
        status: "success",
        statuscode: 200,
        data: {
          result: "Orders retrieved successfully.",
          orders: [
            { id: 1, status: "Ordered", totalAmount: 100.50 }
          ]
        }
      }
    }
    #swagger.responses[500] = {
      description: "Failed to retrieve orders.",
      schema: { 
        status: "error", 
        statuscode: 500, 
        data: { 
          result: "Failed to retrieve orders." 
        }
      }
    }
*/
  try {
    const orders = await orderService.getUserOrders(req.user.userId);
    res.status(200).json({
      status: 'success',
      statuscode: 200,
      data: {
        result: 'Orders retrieved successfully.',
        orders: orders,
      },
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      status: 'error',
      statuscode: 500,
      data: { 
        result: 'Failed to retrieve orders.' 
      },
    });
  }
});

router.get('/:orderId', authMiddleware.checkHeaderForToken, async (req, res) => {
  const { orderId } = req.params;
/*  #swagger.tags = ['Orders']
    #swagger.description = "Retrieve a specific order by ID for the authenticated user."
    #swagger.parameters['orderId'] = {
      in: 'path',
      required: true,
      description: "ID of the order to retrieve."
    }
    #swagger.responses[200] = {
      description: "Order retrieved successfully.",
      schema: {
        status: "success",
        statuscode: 200,
        data: {
          result: "Order retrieved successfully.",
          order: { id: 1, status: "Ordered", totalAmount: 100.50 }
        }
      }
    }
    #swagger.responses[404] = {
      description: "Order not found.",
      schema: { 
        status: "error", 
        statuscode: 404, 
        data: { 
          result: "Order not found." 
        }
      }
    }
    #swagger.responses[500] = {
      description: "Failed to retrieve order.",
      schema: { 
        status: "error", 
        statuscode: 500, 
        data: { 
          result: "Failed to retrieve order." 
        }
      }
    }
 */
  try {
    const order = await orderService.getOneForUser(req.user.userId, orderId);
    if (!order) {
      return res.status(404).json({
        status: 'error',
        statuscode: 404,
        data: { 
          result: 'Order not found.' 
        },
      });
    }

    res.status(200).json({
      status: 'success',
      statuscode: 200,
      data: {
        result: 'Order retrieved successfully.',
        order: order,
      },
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({
      status: 'error',
      statuscode: 500,
      data: { 
        result: 'Failed to retrieve order.' 
      },
    });
  }
});

router.put('/:orderId', authMiddleware.checkHeaderForToken, authMiddleware.isAdmin, async (req, res) => {
/*  #swagger.tags = ['Orders']
    #swagger.description = "Update the status of an order. Admin access is required."
    #swagger.parameters['orderId'] = {
      in: 'path',
      required: true,
      description: "ID of the order to update."
    }
    #swagger.parameters['body'] = {
      in: "body",
      required: true,
      schema: { status: "Completed" },
      description: "The new status for the order."
    }
    #swagger.responses[200] = {
      description: "Order status updated successfully.",
      schema: { 
        status: "success", 
        statuscode: 200, 
        data: { 
          result: "Order status updated successfully." 
        }
      }
    }
    #swagger.responses[400] = {
      description: "Invalid status provided.",
      schema: { 
        status: "error", 
        statuscode: 400, 
        data: { 
          result: "Invalid or missing order status." 
        }
      }
    }
    #swagger.responses[404] = {
      description: "Order not found.",
      schema: { 
        status: "error", 
        statuscode: 404, 
        data: { 
          result: "Order not found." 
        }
      }
    }
    #swagger.responses[500] = {
      description: "Failed to update order status.",
      schema: { 
        status: "error", 
        statuscode: 500, 
        data: { 
          result: "Failed to update order status." 
        }
      }
    }
*/
  const { orderId } = req.params;
  const { status } = req.body;

  if (!status || !['In Progress', 'Ordered', 'Completed'].includes(status)) {
    return res.status(400).json({
      status: 'error',
      statuscode: 400,
      data: { 
        result: 'Invalid or missing order status.' 
      },
    });
  }

  try {
    const updatedOrder = await orderService.updateStatus(orderId, status);
    if (!updatedOrder[0]) {
      return res.status(404).json({
        status: 'error',
        statuscode: 404,
        data: { 
          result: 'Order not found.' 
        },
      });
    }

    res.status(200).json({
      status: 'success',
      statuscode: 200,
      data: { 
        result: 'Order status updated successfully.' 
      },
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({
      status: 'error',
      statuscode: 500,
      data: { 
        result: 'Failed to update order status.' 
      },
    });
  }
});

module.exports = router;