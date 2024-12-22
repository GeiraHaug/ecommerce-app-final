require('dotenv').config();
var express = require('express');
var router = express.Router();
var validator = require('validator');
var models = require('../models');
var authMiddleware = require('../routes/authMiddleware');
var CategoryService = require('../services/CategoryService');
var categoryService = new CategoryService(models);

router.get('/', async (req, res) => {
/*  #swagger.tags = ['Categories']
    #swagger.description = "Retrieve all categories."
    #swagger.responses[200] = {
      description: "Categories retrieved successfully.",
      schema: {
        status: 'success',
        statuscode: 200,
        data: {
          result: "Categories retrieved successfully.",
          categories: [
            { id: 1, name: "Phones" },
            { id: 2, name: "TVs" }
          ]
        }
      }
    }
    #swagger.responses[500] = {
      description: "Failed to retrieve categories.",
      schema: {
        status: 'error',
        statuscode: 500,
        data: { result: "Failed to retrieve categories." }
      }
    }
*/
  try {
    const categories = await categoryService.getAllCategories();
    res.status(200).json({
      status: 'success',
      statuscode: 200,
      data: {
        result: 'Categories retrieved successfully.',
        categories: categories,
      },
    });
  } catch (error) {
    console.error('Error retrieving categories:', error);
    res.status(500).json({
      status: 'error',
      statuscode: 500,
      data: { 
        result: 'Failed to retrieve categories.' 
      },
    });
  }
});

router.post('/', authMiddleware.checkHeaderForToken, authMiddleware.isAdmin, async (req, res) => {
/*  #swagger.tags = ['Categories']
    #swagger.description = "Create a new category."
    #swagger.parameters['body'] = {
      in: 'body',
      description: "Category name to be created.",
      required: true,
      schema: {
        name: "New Category"
      }
    }
    #swagger.responses[201] = {
      description: "Category created successfully.",
      schema: {
        status: 'success',
        statuscode: 201,
        data: {
          result: "Category created successfully.",
          category: { id: 1, name: "New Category" }
        }
      }
    }
    #swagger.responses[400] = {
      description: "Category name is required.",
      schema: {
        status: 'error',
        statuscode: 400,
        data: { result: "Category name is required." }
      }
    }
    #swagger.responses[500] = {
      description: "Failed to create category.",
      schema: {
        status: 'error',
        statuscode: 500,
        data: { result: "Failed to create category." }
      }
    }
*/
  const { name } = req.body;

  if (!name || validator.isEmpty(name)) {
    return res.status(400).json({
      status: 'error',
      statuscode: 400,
      data: { 
        result: 'Category name is required.' 
      },
    });
  }

  try {
    const newCategory = await categoryService.createCategory(name);
    res.status(201).json({
      status: 'success',
      statuscode: 201,
      data: {
        result: 'Category created successfully.',
        category: newCategory,
      },
    });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({
      status: 'error',
      statuscode: 500,
      data: { 
        result: 'Failed to create category.' 
      },
    });
  }
});

router.put('/:categoryId', authMiddleware.checkHeaderForToken, authMiddleware.isAdmin, async (req, res) => {
/*  #swagger.tags = ['Categories']
    #swagger.description = "Update an existing category."
    #swagger.parameters['categoryId'] = {
      in: 'path',
      description: "ID of the category to update.",
      required: true,
      type: 'integer'
    }
    #swagger.parameters['body'] = {
      in: 'body',
      description: "Updated category name.",
      required: true,
      schema: {
        name: "Updated Category"
      }
    }
    #swagger.responses[200] = {
      description: "Category updated successfully.",
      schema: {
        status: 'success',
        statuscode: 200,
        data: {
          result: "Category updated successfully.",
          category: { id: 1, name: "Updated Category" }
        }
      }
    }
    #swagger.responses[400] = {
      description: "Invalid category ID or name.",
      schema: {
        status: 'error',
        statuscode: 400,
        data: { result: "Invalid category ID or name." }
      }
    }
    #swagger.responses[404] = {
      description: "Category not found.",
      schema: {
        status: 'error',
        statuscode: 404,
        data: { result: "Category not found." }
      }
    }
    #swagger.responses[500] = {
      description: "Failed to update category.",
      schema: {
        status: 'error',
        statuscode: 500,
        data: { result: "Failed to update category." }
      }
    }
*/
  const { categoryId } = req.params;
  const { name } = req.body;

  if (!categoryId || !validator.isInt(categoryId)) {
    return res.status(400).json({
      status: 'error',
      statuscode: 400,
      data: { 
        result: 'Invalid category ID.' 
      },
    });
  }

  if (!name || validator.isEmpty(name)) {
    return res.status(400).json({
      status: 'error',
      statuscode: 400,
      data: { 
        result: 'Category name is required.' 
      },
    });
  }

  try {
    const updatedCategory = await categoryService.updateCategory(categoryId, name);
    if (!updatedCategory) {
      return res.status(404).json({
        status: 'error',
        statuscode: 404,
        data: { 
          result: 'Category not found.' 
        },
      });
    }

    res.status(200).json({
      status: 'success',
      statuscode: 200,
      data: {
        result: 'Category updated successfully.',
        category: updatedCategory,
      },
    });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({
      status: 'error',
      statuscode: 500,
      data: { 
        result: 'Failed to update category.' 
      },
    });
  }
});

router.delete('/:categoryId', authMiddleware.checkHeaderForToken, authMiddleware.isAdmin, async (req, res) => {
/*  #swagger.tags = ['Categories']
    #swagger.description = "Delete a category by ID."
    #swagger.parameters['categoryId'] = {
      in: 'path',
      description: "ID of the category to delete.",
      required: true,
      type: 'integer'
    }
    #swagger.responses[200] = {
      description: "Category deleted successfully.",
      schema: {
        status: 'success',
        statuscode: 200,
        data: { result: "Category deleted successfully." }
      }
    }
    #swagger.responses[400] = {
      description: "Invalid category ID.",
      schema: {
        status: 'error',
        statuscode: 400,
        data: { result: "Invalid category ID." }
      }
    }
    #swagger.responses[404] = {
      description: "Category not found.",
      schema: {
        status: 'error',
        statuscode: 404,
        data: { result: "Category not found." }
      }
    }
    #swagger.responses[500] = {
      description: "Failed to delete category.",
      schema: {
        status: 'error',
        statuscode: 500,
        data: { result: "Failed to delete category." }
      }
    }
*/
  const { categoryId } = req.params;

  if (!categoryId || !validator.isInt(categoryId)) {
    return res.status(400).json({
      status: 'error',
      statuscode: 400,
      data: { 
        result: 'Invalid category ID.' 
      },
    });
  }

  try {
    const deletedCategory = await categoryService.deleteCategory(categoryId);
    if (!deletedCategory) {
      return res.status(404).json({
        status: 'error',
        statuscode: 404,
        data: { 
          result: 'Category not found.' 
        },
      });
    }

    res.status(200).json({
      status: 'success',
      statuscode: 200,
      data: { 
        result: 'Category deleted successfully.' 
      },
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({
      status: 'error',
      statuscode: 500,
      data: { 
        result: 'Failed to delete category.' 
      },
    });
  }
});

module.exports = router;