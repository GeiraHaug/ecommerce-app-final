require('dotenv').config();
var express = require('express');
var router = express.Router();
var models = require('../models');
var authMiddleware = require('../routes/authMiddleware');
var RoleService = require('../services/RoleService');
var roleService = new RoleService(models);

router.get('/', authMiddleware.checkHeaderForToken, authMiddleware.isAdmin, async (req, res) => {
/*  #swagger.tags = ['Roles']
    #swagger.description = "Retrieve a list of all roles. Only accessible to admin users."
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.responses[200] = {
      description: "Roles retrieved successfully.",
      schema: {
        status: "success",
        statuscode: 200,
        data: {
          result: "Roles retrieved successfully.",
          roles: [
            { 
              id: 1, 
              name: "Admin" 
            },
            { 
              id: 2, 
              name: "User" 
            }
          ]
        }
      }
    }
    #swagger.responses[500] = {
      description: "Failed to retrieve roles.",
      schema: {
        status: "error",
        statuscode: 500,
        data: { 
          result: "Failed to retrieve roles."
        }
      }
    }
*/
    try {
      const roles = await roleService.getAllRoles();
      res.status(200).json({
        status: 'success',
        statuscode: 200,
        data: {
          result: 'Roles retrieved successfully.',
          roles: roles,
        },
      });
    } catch (error) {
      console.error('Error retrieving brands:', error);
      res.status(500).json({
        status: 'error',
        statuscode: 500,
        data: { 
          result: 'Failed to retrieve roles.' 
        },
      });
    }
  });
  
  module.exports = router;