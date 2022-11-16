const API_CODE = {
  OK: {
    code: 200,
    message: "Successfully served the request",
  },
  NO_CONTENT: {
    code: 204,
    message: "No content found!",
  },
  BAD_REQUEST: {
    code: 400,
    message: "Bad request.. Syntax error!",
  },
  UNAUTHORIZED: {
    code: 401,
    message: "Unauthorized",
  },
  FORBIDDEN: {
    code: 403,
    message: "Forbidden",
  },
  NOT_FOUND: {
    code: 404,
    message: "Not Found",
  },
  INTERNAL_SERVER_ERROR: {
    code: 500,
    message: "Internal Server Error",
  },
};
const response = (message, data) => {
  return {
    message: message || "",
    data: data || {},
  };
};
module.exports = {
  API_CODE,
  response,
};
