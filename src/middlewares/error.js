const ApiError = require("../utils/ApiError");

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  
  if(err instanceof ApiError) {
      res.send(err.statusCode)
  }
};

module.exports = errorHandler;
