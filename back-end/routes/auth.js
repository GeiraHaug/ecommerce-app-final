require('dotenv').config();
var express = require('express');
var router = express.Router();
var validator = require('validator');
var jsonwebtoken = require('jsonwebtoken');
var crypto = require('crypto');
var models = require('../models');
var UserService = require('../services/UserService');
var userService = new UserService(models);

const createToken = (userInfo) => {
  return jsonwebtoken.sign(
    {
      userId: userInfo.Id,
      email: userInfo.Email,
      username: userInfo.Username,
      role: userInfo.Role ? userInfo.Role.Name : "User",
    },
    process.env.TOKEN_SECRET,
    { expiresIn: "2h" }
  );
};

router.post("/register", async (req, res) => {
/*  #swagger.tags = ['Register and Login']
    #swagger.description = 'Register a new user.'
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {
        $firstname: 'John',
        $lastname: 'Doe',
        $username: 'user123',
        $email: 'johndoe@email.com',
        $password: 'password',
        $address: '123 Street, City',
        $phone: '123456789'
      }
    }
    #swagger.responses[201] = {
      description: 'User registered successfully.',
      schema: {
        status: 'success',
        statuscode: 201,
        data: { 
          result: 'You created an account.' 
        }
      }
    }
    #swagger.responses[400] = {
      description: 'Validation error.',
      schema: { 
        status: 'error', 
        statuscode: 400, 
        data: { 
          result: 'Validation error message.' 
        }
      }
    }
    #swagger.responses[500] = {
      description: 'Failed to register user.',
      schema: { 
        status: 'error', 
        statuscode: 500, 
        data: { 
          result: 'Failed registering user.' 
        }
      }
    }
*/
  const { firstname, lastname, username, email, password, address, phone } = req.body;

   if (validator.isEmpty(firstname)) {
    return res.status(400).json({
      status: "error",
      statuscode: 400,
      data: { result: "First name is required." },
    });
  }

  if (validator.isEmpty(lastname)) {
    return res.status(400).json({
      status: "error",
      statuscode: 400,
      data: { result: "Last name is required." },
    });
  }

  if (validator.isEmpty(username)) {
    return res.status(400).json({
      status: "error",
      statuscode: 400,
      data: { result: "Username is required." },
    });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({
      status: "error",
      statuscode: 400,
      data: { result: "Wrong email format." },
    });
  }

  if (validator.isEmpty(password)) {
    return res.status(400).json({
      status: "error",
      statuscode: 400,
      data: { result: "Password is required." },
    });
  }

  if (validator.isEmpty(address)) {
    return res.status(400).json({
      status: "error",
      statuscode: 400,
      data: { result: "Address is required." },
    });
  }

  if (validator.isEmpty(phone)) {
    return res.status(400).json({
      status: "error",
      statuscode: 400,
      data: { result: "Phone number is required." },
    });
  }
  
  try {
    const existingUser = await userService.CheckUniqueUserNameAndEmail(username, email);
    if (existingUser) {
      return res.status(400).json({
        status: "error",
        statuscode: 400,
        data: {
          result: "Username or email already exists.",
        },
      });
    }

    const userRole = await models.Role.findOne({ where: { Name: 'User' } });
    if (!userRole) {
      return res.status(500).json({
        status: "error",
        statuscode: 500,
        data: { result: "Default user role was not found." },
      });
    }

    const bronzeMembership = await models.Membership.findOne({ where: { Name: 'Bronze' } });
    if (!bronzeMembership) {
      return res.status(500).json({
        status: "error",
        statuscode: 500,
        data: { result: "Default bronze membership was not found." },
      });
    }

    const salt = crypto.randomBytes(16);
    crypto.pbkdf2(password, salt, 310000, 32, "sha256", async (err, hashedPassword) => {
      if (err) {
        return res.status(500).json({
          status: "error",
          statuscode: 500,
          data: {
            result: "Error when hashing password.",
          },
        });
      }

      const newUser = await userService.createUser(
        firstname,
        lastname,
        username,
        email,
        hashedPassword,
        salt,
        address,
        phone,
        userRole.Id,
        bronzeMembership.Id
      );

      res.status(201).json({
        status: "success",
        statuscode: 201,
        data: {
          result: "You created an account."
        },
      });
    });

  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({
      status: "error",
      statuscode: 500,
      data: {
        result: "Failed registering user.",
      },
    });
  }
});

router.post("/login", async (req, res) => {
/*  #swagger.tags = ['Register and Login']
    #swagger.description = 'Authenticate a user and return a JWT token.'
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {
        $username: 'Admin',
        $password: 'P@ssword2023'
      }
    }
    #swagger.responses[200] = {
      description: 'Successfully logged in.',
      schema: {
        status: 'success',
        statuscode: 200,
        data: { 
          result: 'Successfully logged in.', 
          token: 'JWT Token', 
          id: 1, 
          email: 'johndoe' 
        }
      }
    }
    #swagger.responses[401] = {
      description: 'Wrong username or password.',
      schema: { 
        status: 'error', 
        statuscode: 401, 
        data: { 
          result: 'Wrong username or password.' 
        }
      }
    }
    #swagger.responses[500] = {
      description: 'Failed to log in.',
      schema: { 
        status: 'error', 
        statuscode: 500, 
        data: { 
          result: 'Failed to log in.' 
        }
      }
    }
*/

  const { username, password } = req.body;

  if (!username) {
    return res.status(400).json({
      status: "error",
      statuscode: 400,
      data: { result: "Username is required." },
    });
  }

  if (!password) {
    return res.status(400).json({
      status: "error",
      statuscode: 400,
      data: { result: "Password is required." },
    });
  }

  try {
      const user = await models.User.findOne({
        where: { Username: username },
        include: models.Role,
      });

      if (!user) {
        return res.status(401).json({
          status: "error",
          statuscode: 401,
          data: { result: "Wrong username or password." },
        });
      }

    crypto.pbkdf2(password, user.Salt, 310000, 32, "sha256", (err, hashedPassword) => {
      if (err) {
        return res.status(500).json({
          status: "error",
          statuscode: 500,
          data: { result: "Error when verifying password." },
        });
      }

      if (!crypto.timingSafeEqual(user.Password, hashedPassword)) {
        return res.status(401).json({
          status: "error",
          statuscode: 401,
          data: { result: "Wrong email or password." },
        });
      }

      const token = createToken(user);

      res.status(200).json({
        status: "success",
        statuscode: 200,
        data: {
          result: "Successfully logged in.",
          id: user.Id,
          email: user.Username,
          name: `${user.FirstName} ${user.LastName}`,
          token: token,
        },
      });
    });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({
      status: "error",
      statuscode: 500,
      data: { result: "Failed to log in." },
    });
  }
});

module.exports = router;