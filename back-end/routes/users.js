require('dotenv').config();
var express = require('express');
var router = express.Router();
var validator = require('validator');
var models = require('../models');
var authMiddleware = require('../routes/authMiddleware');
var UserService = require('../services/UserService');
var userService = new UserService(models);

router.get('/', authMiddleware.checkHeaderForToken, authMiddleware.isAdmin, async (req, res) => {
/*  #swagger.tags = ['Users']
    #swagger.description = "Retrieve all users. Admin access is required."
    #swagger.responses[200] = {
      description: "List of users retrieved successfully.",
      schema: {
        status: "success",
        statuscode: 200,
        data: {
          result: "Users retrieved successfully.",
          users: [
            {
              Id: 1,
              FirstName: "Admin",
              LastName: "Support",
              Username: "Admin",
              Email: "admin@noroff.no",
              Address: "Online",
              Phone: "911",
              createdAt: "2024-12-21T14:23:56.000Z",
              updatedAt: "2024-12-21T14:23:56.000Z",
              MembershipId: null,
              RoleId: 1,
              Membership: null,
              Cart: null,
              Orders: [],
              Role: {
                Id: 1,
                Name: "Admin"
              }
            },
            {
              Id: 2,
              FirstName: "John",
              LastName: "Doe",
              Username: "user123",
              Email: "johndoe@email.com",
              Address: "123 Street, City",
              Phone: "123456789",
              createdAt: "2024-12-21T14:29:40.000Z",
              updatedAt: "2024-12-21T14:29:40.000Z",
              MembershipId: 1,
              RoleId: 2,
              Membership: {
                Id: 1,
                Name: "Bronze",
                FromTotalPurchases: 0,
                ToTotalPurchases: 15,
                Discount: 0
              },
              Cart: null,
              Orders: [],
              Role: {
                Id: 2,
                Name: "User"
              }
            }
          ]
        }
      }
    }
    #swagger.responses[500] = {
      description: "Internal server error.",
      schema: {
        status: "error",
        statuscode: 500,
        data: {
          result: "Failed to retrieve users."
        }
      }
    }
*/
  try {
    const users = await userService.getAllUsers();
    res.status(200).json({
      status: 'success',
      statuscode: 200,
      data: {
        result: 'Users retrieved successfully.',
        users: users,
      },
    });
  } catch (error) {
    console.error('Error retrieving users:', error);
    res.status(500).json({
      status: 'error',
      statuscode: 500,
      data: { 
        result: 'Failed to retrieve users.' 
      },
    });
  }
});

router.put('/:id', authMiddleware.checkHeaderForToken, authMiddleware.isAdmin, async (req, res) => {
/*  #swagger.tags = ['Users']
    #swagger.description = "Update user details by ID. Admin access is required."
    #swagger.parameters['id'] = {
      in: "path",
      description: "ID of the user to be updated.",
      required: true,
      type: "integer"
    }
    #swagger.parameters['body'] = {
      in: "body",
      description: "Fields to update for the user.",
      required: true,
      schema: {
        roleId: 1
      }
    }
    #swagger.responses[200] = {
      description: "User updated successfully.",
      schema: {
        status: "success",
        statuscode: 200,
        data: {
          result: "User updated successfully."
        }
      }
    }
    #swagger.responses[400] = {
      description: "Invalid or missing fields.",
      schema: {
        status: "error",
        statuscode: 400,
        data: {
          result: "Required fields are missing or invalid."
        }
      }
    }
    #swagger.responses[500] = {
      description: "Internal server error.",
      schema: {
        status: "error",
        statuscode: 500,
        data: {
          result: "Failed to update user."
        }
      }
    }
*/
  const { id } = req.params;
  const { firstName, lastName, username, email, address, phone, roleId, membershipId } = req.body;

  try {
    const updatedUser = await userService.updateUser(id, {
      FirstName: firstName,
      LastName: lastName,
      Username: username,
      Email: email,
      Address: address,
      Phone: phone,
      RoleId: roleId,
      MembershipId: membershipId,
    });

    res.status(200).json({
      status: 'success',
      statuscode: 200,
      data: {
        result: 'User updated successfully.',
      },
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      status: 'error',
      statuscode: 500,
      data: { 
        result: 'Failed to update user.' 
      },
    });
  }
});

module.exports = router;
