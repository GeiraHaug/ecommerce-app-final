module.exports = function isAdmin(req, res, next) {
    if (!req.session.token) {
      return res.redirect("/login");
    }
  
    try {
      const decoded = JSON.parse(
        Buffer.from(req.session.token.split(".")[1], "base64").toString()
      );
      if (decoded.role !== "Admin") {
        return res.status(403).send("Access denied. Admins only.");
      }
      next();
    } catch (error) {
      console.error("Error decoding token:", error.message);
      return res.redirect("/login");
    }
  };