// const jwt = require("jsonwebtoken");

// const secret = process.env.JWT_SECRET;

// const authenticateMiddleware = (req, res, next) => {
//   const token = req.headers["x-access-token"];

//   if (!token) {
//     return res.status(401).json({ error: "Authentication token not provided" });
//   }

//   try {
//     const decoded = jwt.verify(token, secret);
//     req.user = decoded; // Attach the user information to the request object
//     next();
//   } catch (error) {
//     return res.status(401).json({ error: "Invalid authentication token" });
//   }
// };

// module.exports = authenticateMiddleware;
