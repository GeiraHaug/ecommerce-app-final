require('dotenv').config();
var express = require('express');
var router = express.Router();
var validator = require('validator');
var models = require('../models');
var authMiddleware = require('../routes/authMiddleware');
var BrandService = require('../services/BrandService');
var brandService = new BrandService(models);

router.get('/', async (req, res) => {
/*  #swagger.tags = ['Brands']
    #swagger.description = "Retrieve all brands."
    #swagger.responses[200] = {
      description: "Brands retrieved successfully.",
      schema: {
        status: 'success',
        statuscode: 200,
        data: {
          result: 'Brands retrieved successfully.',
          brands: [{ id: 1, name: 'Example Brand' }]
        }
      }
    }
    #swagger.responses[500] = {
      description: "Failed to retrieve brands.",
      schema: {
        status: 'error',
        statuscode: 500,
        data: {
          result: 'Failed to retrieve brands.'
        }
      }
    }
*/
  try {
    const brands = await brandService.getAllBrands();
    res.status(200).json({
      status: 'success',
      statuscode: 200,
      data: {
        result: 'Brands retrieved successfully.',
        brands: brands,
      },
    });
  } catch (error) {
    console.error('Error retrieving brands:', error);
    res.status(500).json({
      status: 'error',
      statuscode: 500,
      data: { 
        result: 'Failed to retrieve brands.' 
      },
    });
  }
});

router.post('/', authMiddleware.checkHeaderForToken, authMiddleware.isAdmin, async (req, res) => {
/*  #swagger.tags = ['Brands']
    #swagger.description = "Create a new brand."
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Brand name to be created.',
      required: true,
      schema: {
        name: "New Brand"
      }
    }
    #swagger.responses[201] = {
      description: "Brand created successfully.",
      schema: {
        status: "success",
        statuscode: 201,
        data: {
          result: "Brand created successfully.",
          brand: { id: 1, name: "New Brand" }
        }
      }
    }
    #swagger.responses[400] = {
      description: "Validation error - Brand name is missing or invalid.",
      schema: {
        status: "error",
        statuscode: 400,
        data: {
          result: "Brand name is required."
        }
      }
    }
    #swagger.responses[500] = {
      description: "Failed to create brand.",
      schema: {
        status: "error",
        statuscode: 500,
        data: {
          result: "Failed to create brand."
        }
      }
    }
*/
  const { name } = req.body;

  if (!name || validator.isEmpty(name)) {
    return res.status(400).json({
      status: 'error',
      statuscode: 400,
      data: { 
        result: 'Brand name is required.' 
      },
    });
  }

  try {
    const newBrand = await brandService.createBrand(name);
    res.status(201).json({
      status: 'success',
      statuscode: 201,
      data: {
        result: 'Brand created successfully.',
        brand: newBrand,
      },
    });
  } catch (error) {
    console.error('Error creating brand:', error);
    res.status(500).json({
      status: 'error',
      statuscode: 500,
      data: { 
        result: 'Failed to create brand.' 
      },
    });
  }
});

router.put('/:brandId', authMiddleware.checkHeaderForToken, authMiddleware.isAdmin, async (req, res) => {
/*  #swagger.tags = ['Brands']
    #swagger.description = "Update a specific brand."
    #swagger.parameters['brandId'] = {
      in: 'path',
      description: 'ID of the brand to be updated.',
      required: true,
      type: 'integer'
    }
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Updated brand name.',
      required: true,
      schema: {
        name: "Updated Brand Name"
      }
    }
    #swagger.responses[200] = {
      description: "Brand updated successfully.",
      schema: {
        status: "success",
        statuscode: 200,
        data: {
          result: "Brand updated successfully.",
          brand: { id: 1, name: "Updated Brand Name" }
        }
      }
    }
    #swagger.responses[400] = {
      description: "Validation error - Missing or invalid parameters.",
      schema: {
        status: "error",
        statuscode: 400,
        data: {
          result: "Invalid brand ID."
        }
      }
    }
    #swagger.responses[404] = {
      description: "Brand not found.",
      schema: {
        status: "error",
        statuscode: 404,
        data: {
          result: "Brand not found."
        }
      }
    }
    #swagger.responses[500] = {
      description: "Failed to update brand.",
      schema: {
        status: "error",
        statuscode: 500,
        data: {
          result: "Failed to update brand."
        }
      }
    }
*/
  const { brandId } = req.params;
  const { name } = req.body;

  if (!brandId || !validator.isInt(brandId)) {
    return res.status(400).json({
      status: 'error',
      statuscode: 400,
      data: { 
        result: 'Invalid brand ID.' 
      },
    });
  }

  if (!name || validator.isEmpty(name)) {
    return res.status(400).json({
      status: 'error',
      statuscode: 400,
      data: { 
        result: 'Brand name is required.' 
      },
    });
  }

  try {
    const updatedBrand = await brandService.updateBrand(brandId, name);
    if (!updatedBrand) {
      return res.status(404).json({
        status: 'error',
        statuscode: 404,
        data: { 
          result: 'Brand not found.' 
        },
      });
    }

    res.status(200).json({
      status: 'success',
      statuscode: 200,
      data: {
        result: 'Brand updated successfully.',
        brand: updatedBrand,
      },
    });
  } catch (error) {
    console.error('Error updating brand:', error);
    res.status(500).json({
      status: 'error',
      statuscode: 500,
      data: { 
        result: 'Failed to update brand.' 
      },
    });
  }
});

router.delete('/:brandId', authMiddleware.checkHeaderForToken, authMiddleware.isAdmin, async (req, res) => {
/*  #swagger.tags = ['Brands']
    #swagger.description = "Delete a specific brand."
    #swagger.parameters['brandId'] = {
      in: 'path',
      description: 'ID of the brand to be deleted.',
      required: true,
      type: 'integer'
    }
    #swagger.responses[200] = {
      description: "Brand deleted successfully.",
      schema: {
        status: "success",
        statuscode: 200,
        data: {
          result: "Brand deleted successfully."
        }
      }
    }
    #swagger.responses[400] = {
      description: "Validation error - Missing or invalid brand ID.",
      schema: {
        status: "error",
        statuscode: 400,
        data: {
          result: "Invalid brand ID."
        }
      }
    }
    #swagger.responses[404] = {
      description: "Brand not found.",
      schema: {
        status: "error",
        statuscode: 404,
        data: {
          result: "Brand not found."
        }
      }
    }
    #swagger.responses[500] = {
      description: "Failed to delete brand.",
      schema: {
        status: "error",
        statuscode: 500,
        data: {
          result: "Failed to delete brand."
        }
      }
    }
*/
  const { brandId } = req.params;

  if (!brandId || !validator.isInt(brandId)) {
    return res.status(400).json({
      status: 'error',
      statuscode: 400,
      data: { 
        result: 'Invalid brand ID.' 
      },
    });
  }

  try {
    const deletedBrand = await brandService.deleteBrand(brandId);
    if (!deletedBrand) {
      return res.status(404).json({
        status: 'error',
        statuscode: 404,
        data: { 
          result: 'Brand not found.' 
        },
      });
    }

    res.status(200).json({
      status: 'success',
      statuscode: 200,
      data: { 
        result: 'Brand deleted successfully.' 
      },
    });
  } catch (error) {
    console.error('Error deleting brand:', error);
    res.status(500).json({
      status: 'error',
      statuscode: 500,
      data: { 
        result: 'Failed to delete brand.' 
      },
    });
  }
});

module.exports = router;