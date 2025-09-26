const successResponse = (res, message, data = null, statusCode = 200) => {
  const response = {
    success: true,
    message
  };
  
  if (data !== null) {
    response.data = data;
  }
  
  return res.status(statusCode).json(response);
};

const errorResponse = (res, message, statusCode = 400, details = null) => {
  const response = {
    success: false,
    message
  };
  
  if (details) {
    response.details = details;
  }
  
  return res.status(statusCode).json(response);
};

module.exports = {
  successResponse,
  errorResponse
};