const roleMiddleware = (...allowedRoles) => {

  return (req, res, next) => {

    try {

      if (!req.user) {
        return res.status(401).json({
          message: "Unauthorized: user not authenticated"
        });
      }

      const userRole = req.user.role;

      if (!allowedRoles.includes(userRole)) {

        return res.status(403).json({
          message: "Access forbidden: insufficient permissions"
        });

      }

      next();

    }
    catch (error) {

      console.error("Role middleware error:", error);

      return res.status(500).json({
        message: "Role verification failed"
      });

    }

  };

};

module.exports = roleMiddleware;