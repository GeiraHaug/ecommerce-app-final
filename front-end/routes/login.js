const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('login', { error: null });
});

router.post('/', async (req, res) => {
    const { username, password } = req.body;
  
    try {
      const response = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        const { token, result } = data.data;
        const role = JSON.parse(atob(token.split('.')[1])).role;
  
        if (role === 'Admin') {
          req.session.token = token;
          return res.redirect('/products');
        } else {
          return res.render('login', { error: 'Only admins can log in.' });
        }
      } else {
        return res.render('login', { error: data.data?.result || 'Invalid login credentials.' });
      }
    } catch (error) {
      console.error('Login error:', error.message);
      res.render('login', { error: 'An error occurred during login.' });
    }
  });

module.exports = router;