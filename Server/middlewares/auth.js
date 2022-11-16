const jwt = require("jsonwebtoken");
const { db } = require("../utils/db");
const { API_CODE, response } = require("../utils/response/response.js");

function isAuthenticated(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).send(response(API_CODE.UNAUTHORIZED.message));
  }

  try {
    const token = authorization.split(" ")[1];
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.payload = payload;
    return next();
  } catch (err) {
    res.status(API_CODE.UNAUTHORIZED.code);
    if (err.name === "TokenExpiredError") {
      return res.send(response("Session Expired"));
    }
    return res.send(response(API_CODE.UNAUTHORIZED.message));
  }
}

function isAuthenticatedAdmin(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization && db.user.role == "admin") {
    res.status(401);
    throw new Error("Un-Authorized");
  }

  try {
    const token = authorization.split(" ")[1];
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.payload = payload;
  } catch (err) {
    res.status(401);
    if (err.name === "TokenExpiredError") {
      throw new Error(err.name);
    }
    throw new Error("Un-Authorized");
  }

  return next();
}

function revokeTokens(userId) {
  return db.refreshToken.updateMany({
    where: {
      user_id: userId,
    },
    data: {
      revoked: true,
    },
  });
}

module.exports = {
  isAuthenticated,
  revokeTokens,
};
