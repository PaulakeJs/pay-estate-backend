const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.header("authorization").split(" ")[1];
    const dtoken = jwt.verify(token, "pjs");
    req.body.userId = dtoken.userId;
    next();
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
};
