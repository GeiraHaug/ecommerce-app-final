require('dotenv').config();
var express = require('express');
var router = express.Router();
var validator = require('validator');
var authMiddleware = require('../routes/authMiddleware');
var models = require('../models');
var MembershipService = require('../services/MembershipService');
var membershipService = new MembershipService(models);

router.get('/', async (req, res) => {
/*  #swagger.tags = ['Memberships']
    #swagger.description = "Retrieve all memberships from the database."
    #swagger.responses[200] = {
      description: "Memberships retrieved successfully.",
      schema: {
        status: "success",
        statuscode: 200,
        data: {
          result: "Memberships retrieved successfully.",
          memberships: [{ 
            id: 1, 
            name: "Bronze", 
            fromTotalPurchases: 0, 
            toTotalPurchases: 15, 
            discount: 0 
          }]
        }
      }
    }
    #swagger.responses[500] = {
      description: "Failed to fetch memberships.",
      schema: { 
        status: "error", 
        statuscode: 500, 
        data: { 
          result: "Failed to fetch memberships." 
        }
      }
    }
*/
  try {
    const memberships = await membershipService.getAllMemberships();
    res.status(200).json({
      status: 'success',
      statuscode: 200,
      data: {
        result: 'Memberships retrieved successfully.',
        memberships: memberships,
      },
    });
  } catch (error) {
    console.error('Error fetching memberships:', error);
    res.status(500).json({
      status: 'error',
      statuscode: 500,
      data: { 
        result: 'Failed to fetch memberships.' 
      },
    });
  }
});

router.post('/', authMiddleware.checkHeaderForToken, authMiddleware.isAdmin, async (req, res) => {
/*  #swagger.tags = ['Memberships']
    #swagger.description = "Create a new membership. Admin only."
    #swagger.parameters['body'] = {
      in: "body",
      description: "Membership details",
      required: true,
      schema: {
        $name: "New Membership",
        $fromTotalPurchases: 45,
        $toTotalPurchases: 60,
        $discount: 30
      }
    }
    #swagger.responses[201] = {
      description: "Membership created successfully.",
      schema: {
        status: "success",
        statuscode: 201,
        data: { 
          result: "Membership created successfully.", 
          membership: { 
            id: 1, 
            name: "New Membership" 
          }
        }
      }
    }
    #swagger.responses[400] = {
      description: "Invalid input data.",
      schema: { 
        status: "error", 
        statuscode: 400, 
        data: { 
          result: "Validation error message." 
        }
      }
    }
    #swagger.responses[500] = {
      description: "Failed to create membership.",
      schema: { 
        status: "error", 
        statuscode: 500, 
        data: { 
          result: "Failed to create membership." 
        }
      }
    }
*/
  const { name, fromTotalPurchases, toTotalPurchases, discount } = req.body;

  if (!name || validator.isEmpty(name)) {
    return res.status(400).json({
      status: 'error',
      statuscode: 400,
      data: { 
        result: 'Membership name is required.' 
      },
    });
  }

  if (!validator.isInt(fromTotalPurchases?.toString())) {
    return res.status(400).json({
      status: 'error',
      statuscode: 400,
      data: { 
        result: 'fromTotalPurchases must be an integer.' 
      },
    });
  }

  if (!validator.isInt(toTotalPurchases?.toString())) {
    return res.status(400).json({
      status: 'error',
      statuscode: 400,
      data: { 
        result: 'toTotalPurchases must be an integer.' 
      },
    });
  }

  if (!validator.isInt(discount?.toString())) {
    return res.status(400).json({
      status: 'error',
      statuscode: 400,
      data: { 
        result: 'Discount must be an integer.' 
      },
    });
  }

  try {
    const newMembership = await membershipService.createMembership(
      name,
      parseInt(fromTotalPurchases),
      parseInt(toTotalPurchases),
      parseInt(discount)
    );
    res.status(201).json({
      status: 'success',
      statuscode: 201,
      data: {
        result: 'Membership created successfully.',
        membership: newMembership,
      },
    });
  } catch (error) {
    console.error('Error creating membership:', error);
    res.status(500).json({
      status: 'error',
      statuscode: 500,
      data: { 
        result: 'Failed to create membership.' 
      },
    });
  }
});

router.put('/:membershipId', authMiddleware.checkHeaderForToken, authMiddleware.isAdmin, async (req, res) => {
/*  #swagger.tags = ['Memberships']
    #swagger.description = "Update a membership by ID. Admin only."
    #swagger.parameters['membershipId'] = {
      in: "path",
      required: true,
      description: "ID of the membership to update"
    }
    #swagger.parameters['body'] = {
      in: "body",
      description: "Updated membership details",
      schema: { 
        name: "Silver", 
        fromTotalPurchases: 15, 
        toTotalPurchases: 30, 
        discount: 15 
      }
    }
    #swagger.responses[200] = {
      description: "Membership updated successfully.",
      schema: { 
        status: "success", 
        statuscode: 200, 
        data: {  
          result: "Membership updated successfully." 
        }
      }
    }
    #swagger.responses[404] = {
      description: "Membership not found.",
      schema: { 
        status: "error", 
        statuscode: 404, 
        data: { 
          result: "Membership not found." 
        }
      }
    }
    #swagger.responses[500] = {
      description: "Failed to update membership.",
      schema: { 
        status: "error", 
        statuscode: 500, 
        data: { 
          result: "Failed to update membership." 
        }
      }
    }
*/
  const { membershipId } = req.params;
  const { name } = req.body;

  try {
    const updatedMembership = await membershipService.updateMembership(membershipId, name);
    if (!updatedMembership) {
      return res.status(404).json({
        status: 'error',
        statuscode: 404,
        data: { 
          result: 'Membership not found.' 
        },
      });
    }

    res.status(200).json({
      status: 'success',
      statuscode: 200,
      data: {
        result: 'Membership updated successfully.',
        membership: updatedMembership,
      },
    });
  } catch (error) {
    console.error('Error updating membership:', error);
    res.status(500).json({
      status: 'error',
      statuscode: 500,
      data: { 
        result: 'Failed to update membership.' 
      },
    });
  }
});

router.delete('/:membershipId', authMiddleware.checkHeaderForToken, authMiddleware.isAdmin, async (req, res) => {
/*  #swagger.tags = ['Memberships']
    #swagger.description = "Delete a membership by ID. Admin only."
    #swagger.parameters['membershipId'] = {
      in: "path",
      required: true,
      description: "ID of the membership to delete"
    }
    #swagger.responses[200] = {
      description: "Membership deleted successfully.",
      schema: { 
        status: "success", 
        statuscode: 200, 
        data: { 
          result: "Membership deleted successfully." 
        }
      }
    }
    #swagger.responses[404] = {
      description: "Membership not found.",
      schema: { 
        status: "error", 
        statuscode: 404, 
        data: { 
          result: "Membership not found." 
        }
      }
    }
    #swagger.responses[500] = {
      description: "Failed to delete membership.",
      schema: { 
        status: "error", 
        statuscode: 500, 
        data: { 
          result: "Failed to delete membership." 
        }
      }
    }
*/
  const { membershipId } = req.params;

  try {
    const deleted = await membershipService.deleteMembership(membershipId);
    if (!deleted) {
      return res.status(404).json({
        status: 'error',
        statuscode: 404,
        data: { 
          result: 'Membership not found.' 
        },
      });
    }

    res.status(200).json({
      status: 'success',
      statuscode: 200,
      data: { 
        result: 'Membership deleted successfully.' 
      },
    });
  } catch (error) {
    console.error('Error deleting membership:', error);
    res.status(500).json({
      status: 'error',
      statuscode: 500,
      data: { 
        result: 'Failed to delete membership.' 
      },
    });
  }
});

module.exports = router;