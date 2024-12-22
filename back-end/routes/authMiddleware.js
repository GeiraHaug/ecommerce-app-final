require('dotenv').config();
var jsonwebtoken = require('jsonwebtoken');

module.exports = {
  checkHeaderForToken: (req, res, next) => {
    if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      jsonwebtoken.verify(req.headers.authorization.split(' ')[1], process.env.TOKEN_SECRET, (err, decoded) => {

        if (err) {
          req.user = undefined;
          return res.status(403).json({
            status: "error",
            statuscode: 403,
            data: {
              result: "Expired or invalid token.",
            },
          });
        }
        req.user = decoded;
        next();
      });
    } else {
      req.user = undefined;
      return res.status(401).json({
        status: "error",
        statuscode: 401,
        data: {
          result: "Missing or wrong Authorization header.",
        },
      });
    }
  },

  isAdmin: (req, res, next) => {
    if (req.user && req.user.role === 'Admin') {
      next();
    } else {
      return res.status(403).json({
        status: "error",
        statuscode: 403,
        data: {
          result: "Only admin can access.",
        },
      });
    }
  },

  canSeeUserDetails: (req, res, next) => {
    if (req.user && (req.user.role === 'Admin' || req.user.userId === parseInt(req.params.userId, 10))) {
      next();
    } else {
      return res.status(403).json({
        status: "error",
        statuscode: 403,
        data: {
          result: "Access denied.",
        },
      });
    }
  },
};