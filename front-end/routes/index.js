var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('login', { error: null });
});

router.get('/products', (req, res) => {
  if (!req.session.token) {
    return res.redirect('/login');
  }
  res.render('products', { title: 'Products' });
});

module.exports = router;