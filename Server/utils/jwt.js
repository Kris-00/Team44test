const jwt = require("jsonwebtoken");

function generateAccessToken(user) {
  return jwt.sign({ userId: user.id }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: "5m",
  });
}

function generateRefreshToken(user, jti) {
  return jwt.sign(
    {
      user_id: user.id,
      jti,
    },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: "15m",
    }
  );
}

function generateTokens(user, jti) {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user, jti);
  return {
    accessToken,
    refreshToken,
  };
}

function generateOTPToken(otp, id) {
  return jwt.sign(
    {
      otp: otp,
      user_id: id,
    },
    process.env.OTP_SECRET,
    {
      algorithm: "HS512",
      expiresIn: "5m",
    }
  );
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  generateTokens,
  generateOTPToken,
};
