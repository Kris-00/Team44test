const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const { generateOTPToken, generateTokens } = require("../../utils/jwt");
const express = require("express");
const { isAuthenticated, revokeTokens } = require("../../middlewares/auth");
const { db } = require("../../utils/db");
const { hashToken } = require("../../utils/hashToken");

const {
  addRefreshTokenToWhitelist,
  findRefreshTokenById,
  deleteRefreshToken,
} = require("../../services/auth.service");
const {
  findUserByEmail,
  createUserByEmailAndPassword,
  createAdminByEmailAndPassword,
  findUserById,
  findUserByIdFirst,
} = require("../../services/user.service");
const jwt = require("jsonwebtoken");
const { API_CODE, response } = require("../../utils/response/response.js");

const validate = require("validator");
const { generateOTP } = require("../../services/otp.js");
const { sendMail } = require("../../services/email.service.js");
const potatoLogger = require("../../middlewares/winston");

// const { findUserById } = require('./users.services');
const router = express.Router();
const prisma = db;

// GET ALL USERS
router.get("/api/users", isAuthenticated, async (req, res, next) => {
  try {
    const { id, role } = req.query;
    if (role !== "admin") {
      potatoLogger.warning(
        `IP ${req.ip} who is not admin with ID ${id} has failed to fetch all users ${req.method} via ${req.originalUrl} from ${req.headers["user-agent"]}`
      );
      res.status(401);
      throw new Error("You are not authorized to perform this action.");
    } else if (role === "admin") {
      potatoLogger.critical(
        `IP ${req.ip} with ID ${id} has fetched all users ${req.method} via ${req.originalUrl} from ${req.headers["user-agent"]}`
      );
      const user = await prisma.user.findMany({});
      res.json(user);
    }
  } catch (error) {
    potatoLogger.error(
      `IP ${req.ip} with ID ${id} has failed to fetch all users ${req.method} via ${req.originalUrl} from ${req.headers["user-agent"]} with error ${error}`
    );
    return res
      .status(API_CODE.INTERNAL_SERVER_ERROR.code)
      .send(response(API_CODE.INTERNAL_SERVER_ERROR.message));
  }
});

// GET USER BY ID
router.get("/api/user/:id", isAuthenticated, async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: {
        id: String(id),
      },
    });
    res.json(user);
  } catch (error) {
    return res
      .status(API_CODE.INTERNAL_SERVER_ERROR.code)
      .send(response(API_CODE.INTERNAL_SERVER_ERROR.message));
  }
});

//POST
router.post("/api/register", async (req, res, next) => {
  try {
    const { full_name, email, password, phone, isActivate } = req.body;

    if (full_name === "" || password === "" || email === "" || phone === "") {
      potatoLogger.info(
        `IP ${req.ip} tried to register with empty fields ${req.method} via ${req.originalUrl} from ${req.headers["user-agent"]}`
      );
      return res
        .status(API_CODE.BAD_REQUEST.code)
        .send(response("Fields cannot be empty."));
    }
    potatoLogger.info(
      `IP ${req.ip} tried to register with empty fields ${req.method} via ${req.originalUrl} from ${req.headers["user-agent"]}`
    );

    if (
      !validate.isEmail(email) ||
      !validate.isStrongPassword(password) ||
      !validate.isNumeric(phone)
    ) {
      potatoLogger.warning(
        `IP ${req.ip} tried to register with invalid data ${req.method} via ${req.originalUrl} from ${req.headers["user-agent"]}`
      );
      return res
        .status(API_CODE.BAD_REQUEST.code)
        .send(
          response(
            "Invalid email or password not strong enough." +
              "<br>Password must contain one uppercase, one number and one special character." +
              "<br> Password must be at least 8 characters and max at 16 characters"
          )
        );
    }

    let e = validate.normalizeEmail(email);
    e = validate.escape(e);
    let fn = validate.escape(full_name);
    fn = validate.trim(fn);

    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      potatoLogger.warning(
        `IP ${req.ip} tried to register with existing email ${email} through ${req.method} via ${req.originalUrl} from ${req.headers["user-agent"]}`
      );
      return res
        .status(API_CODE.BAD_REQUEST.code)
        .send(response("Account already exist"));
    }
    const user = await createUserByEmailAndPassword({
      full_name: fn,
      email: e,
      password: password,
      phone: phone,
    });
    potatoLogger.critical(
      `IP ${req.ip} has registered with email ${email} through ${req.method} via ${req.originalUrl} from ${req.headers["user-agent"]}`
    );
    return res.status(API_CODE.OK.code).send(response(API_CODE.OK.message));
  } catch (error) {
    potatoLogger.error(
      `IP ${req.ip} has failed to register through ${req.method} via ${req.originalUrl} from ${req.headers["user-agent"]} with error ${error}`
    );
    return res
      .status(API_CODE.INTERNAL_SERVER_ERROR.code)
      .send(response(API_CODE.INTERNAL_SERVER_ERROR.message));
  }
});

router.post("/api/admin/create", isAuthenticated, async (req, res, next) => {
  try {
    const { full_name, email, password, phone, isActivate } = req.body;

    if (full_name === "" || password === "" || email === "" || phone === "") {
      potatoLogger.info(
        `IP ${req.ip} tried to register admin with empty fields ${req.method} via ${req.originalUrl} from ${req.headers["user-agent"]}`
      );
      return res
        .status(API_CODE.BAD_REQUEST.code)
        .send(response("Fields cannot be empty."));
    }

    if (
      !validate.isEmail(email) ||
      !validate.isStrongPassword(password) ||
      !validate.isNumeric(phone)
    ) {
      potatoLogger.warning(
        `IP ${req.ip} tried to register admin with invalid data ${req.method} via ${req.originalUrl} from ${req.headers["user-agent"]}`
      );
      return res
        .status(API_CODE.BAD_REQUEST.code)
        .send(
          response(
            "Invalid email or password not strong enough." +
              "<br>Password must contain one uppercase, one number and one special character." +
              "<br> Password must be at least 8 characters and max at 16 characters"
          )
        );
    }

    let e = validate.normalizeEmail(email);
    e = validate.escape(e);
    let fn = validate.escape(full_name);
    fn = validate.trim(fn);

    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      potatoLogger.warning(
        `IP ${req.ip} tried to create an existing account through ${req.method} via ${req.originalUrl} from ${req.headers["user-agent"]}`
      );
      return res
        .status(API_CODE.BAD_REQUEST.code)
        .send(response("Account already exist"));
    }
    let status = "unlocked";
    if (!isActivate) {
      status = "locked";
      potatoLogger.warning(`IP ${req.ip} admin account ${email} is locked`);
    }
    let new_user = {
      full_name: full_name,
      email: e,
      password: password,
      phone: phone,
      status: status,
      user_role: "admin",
    };
    const user = await createAdminByEmailAndPassword(new_user);
    potatoLogger.info(
      `IP ${req.ip} has created an Admin ${user.email} through ${req.method} via ${req.originalUrl} from ${req.headers["user-agent"]}`
    );
    return res.status(API_CODE.OK.code).send(response(API_CODE.OK.message));
  } catch (error) {
    potatoLogger.error(
      `IP ${req.ip} has attempted to login through ${req.method} via ${req.originalUrl} from ${req.headers["user-agent"]}`
    );
    return res
      .status(API_CODE.INTERNAL_SERVER_ERROR.code)
      .send(response(API_CODE.INTERNAL_SERVER_ERROR.message));
  }
});

router.post("/api/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    let e = email;
    let p = password;

    if (!e || !p) {
      return res
        .status(API_CODE.BAD_REQUEST.code)
        .send(response("You must provide an email and a password."));
    }

    if (
      !validate.isEmail(e) ||
      !validate.isStrongPassword(p, {
        minLength: 8,
      })
    ) {
      return res
        .status(API_CODE.BAD_REQUEST.code)
        .send(response("Invalid user email or password"));
    }
    e = validate.normalizeEmail(e);
    e = validate.escape(e);

    const existingUser = await findUserByEmail(e);

    if (!existingUser) {
      return res
        .status(API_CODE.BAD_REQUEST.code)
        .send(response("Invalid user email or password"));
    }

    const validPassword = await bcrypt.compare(p, existingUser.password);
    if (!validPassword) {
      return res
        .status(API_CODE.UNAUTHORIZED.code)
        .send(response("Invalid user email or password. Please try again"));
    }
    potatoLogger.info(
      `IP ${req.ip} has attempted to login ${existingUser.email} through ${req.method} via ${req.originalUrl} from ${req.headers["user-agent"]}`
    );
    const otpGenerated = generateOTP();
    const otpToken = generateOTPToken(otpGenerated, existingUser.id);
    let encrypted_otp = bcrypt.hashSync(otpGenerated, 12);
    res.cookie("otp", otpToken);
    existingUser.otp = encrypted_otp;
    try {
      await prisma.user.update({
        where: {
          email: e,
        },
        data: existingUser,
      });

      await sendMail({
        to: email,
        OTP: otpGenerated,
      });
    } catch (error) {
      potatoLogger.error(
        `IP ${req.ip} has failed to login ${existingUser.email} through ${req.method} via ${req.originalUrl} from ${req.headers["user-agent"]} with error ${error}`
      );
      return res
        .status(API_CODE.INTERNAL_SERVER_ERROR.code)
        .send(response(API_CODE.INTERNAL_SERVER_ERROR.message));
    }

    res.json({});
  } catch (error) {
    potatoLogger.error(
      `IP ${req.ip} has failed to login ${existingUser.email} through ${req.method} via ${req.originalUrl} from ${req.headers["user-agent"]} with error ${error}`
    );
    return res
      .status(API_CODE.INTERNAL_SERVER_ERROR.code)
      .send(response(API_CODE.INTERNAL_SERVER_ERROR.message));
  }
});

router.post("/api/verifyOTP", async (req, res, next) => {
  try {
    const token_otp = req.cookies.otp;
    var input_otp = req.body.otp;
    // verify a token symmetric
    let isTrue = jwt.verify(token_otp, process.env.OTP_SECRET);
    if (isTrue) {
      var decoded = jwt.decode(token_otp, { complete: true });
      let id = decoded.payload.user_id;
      potatoLogger.warning(
        `IP ${req.ip} has successfully logged in ${id} through ${req.method} via ${req.originalUrl} from ${req.headers["user-agent"]}`
      );
      const user = await prisma.user.findUnique({
        where: {
          id: String(id),
        },
      });
      if (user) {
        let otp_compare = await bcrypt.compare(input_otp, user.otp);
        if (otp_compare) {
          res.clearCookie("otp");
          user.otp = null;
          try {
            await prisma.user.update({
              where: {
                id: user.id,
              },
              data: user,
            });
            const jti = uuidv4();
            const { accessToken, refreshToken } = generateTokens(user, jti);
            await addRefreshTokenToWhitelist({
              jti,
              refreshToken,
              userId: user.id,
            });

            res.cookie("refToken", refreshToken);
            return res.status(API_CODE.OK.code).send(
              response(API_CODE.OK.message, {
                accessToken: accessToken,
                role: user.user_role,
                name: user.full_name,
              })
            );
          } catch (error) {
            return res
              .status(API_CODE.INTERNAL_SERVER_ERROR.code)
              .send(response(API_CODE.INTERNAL_SERVER_ERROR.message));
          }
        }
        potatoLogger.warning(
          `IP ${req.ip} has failed to login ${id} through ${req.method} via ${req.originalUrl} from ${req.headers["user-agent"]} Invalid OTP`
        );
        return res
          .status(API_CODE.BAD_REQUEST.code)
          .send(response("Invalid OTP."));
      }
    } else {
      potatoLogger.warning(
        `IP ${req.ip} has failed to login ${id} through ${req.method} via ${req.originalUrl} from ${req.headers["user-agent"]} Expired OTP`
      );
      return res
        .status(API_CODE.BAD_REQUEST.code)
        .send(response("The OTP expired."));
    }
  } catch (error) {
    potatoLogger.error(
      `IP ${req.ip} has failed to login ${id} through ${req.method} via ${req.originalUrl} from ${req.headers["user-agent"]} ${error}`
    );
    return res
      .status(API_CODE.INTERNAL_SERVER_ERROR.code)
      .send(response(API_CODE.INTERNAL_SERVER_ERROR.message));
  }
});

router.post("/api/refreshToken", isAuthenticated, async (req, res, next) => {
  try {
    const refToken = req.cookies.refToken;
    if (!refToken) {
      potatoLogger.warning(
        `IP ${req.ip} has failed to refresh token through ${req.method} via ${req.originalUrl} from ${req.headers["user-agent"]} Missing refresh token`
      );
      return res.status(400).send(response("Missing refresh token."));
    }

    const payload = jwt.verify(refToken, process.env.JWT_REFRESH_SECRET);
    const savedRefToken = await findRefreshTokenById(payload.jti);

    if (!savedRefToken || savedRefToken.revoked === true) {
      potatoLogger.critical(
        `IP ${req.ip} has failed to refresh token through ${req.method} via ${req.originalUrl} from ${req.headers["user-agent"]} Unauthorized refresh token`
      );
      return res.status(401).send(response(API_CODE.UNAUTHORIZED.message));
    }

    const hashedToken = hashToken(refToken);
    if (hashedToken !== savedRefToken.hashedToken) {
      potatoLogger.critical(
        `IP ${req.ip} has failed to refresh token through ${req.method} via ${req.originalUrl} from ${req.headers["user-agent"]} Unauthorized refresh token`
      );
      return res.status(401).send(response(API_CODE.UNAUTHORIZED.message));
    }

    const user = await findUserById(payload.userId);

    if (!user) {
      potatoLogger.critical(
        `IP ${req.ip} has failed to refresh token through ${req.method} via ${req.originalUrl} from ${req.headers["user-agent"]} Unauthorized invalid user refresh token`
      );
      return res.status(401).send(response(API_CODE.UNAUTHORIZED.message));
    }

    await deleteRefreshToken(savedRefToken.id);
    const jti = uuidv4();
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(
      user,
      jti
    );
    potatoLogger.info(
      `IP ${req.ip} has successfully deleted token through ${req.method} via ${req.originalUrl} from ${req.headers["user-agent"]}`
    );

    await addRefreshTokenToWhitelist({
      jti,
      refreshToken: newRefreshToken,
      userId: user.id,
    });
    potatoLogger.info(
      `IP ${req.ip} has successfully refreshed token through ${req.method} via ${req.originalUrl} from ${req.headers["user-agent"]}`
    );
    res.cookie("refToken", newRefreshToken);
    return res.status(200).send(response(API_CODE.OK.message, accessToken));
  } catch (error) {
    potatoLogger.error(
      `IP ${req.ip} has failed to refresh token through ${req.method} via ${req.originalUrl} from ${req.headers["user-agent"]} ${error}`
    );
    return res
      .status(API_CODE.INTERNAL_SERVER_ERROR.code)
      .send(response(API_CODE.INTERNAL_SERVER_ERROR.message));
  }
});
router.post("/api/revokeRefreshTokens", async (req, res, next) => {
  try {
    const token_session = req.cookies.refToken;
    // verify a token symmetric
    let isTrue = jwt.verify(token_session, process.env.JWT_REFRESH_SECRET);
    if (isTrue) {
      var decoded = jwt.decode(token_session, { complete: true });
      let userId = decoded.payload.user_id;
      await revokeTokens(userId);
      res.clearCookie("refToken");
      potatoLogger.warning(
        `IP ${req.ip} has successfully revoked token through ${req.method} via ${req.originalUrl} from ${req.headers["user-agent"]}`
      );
      res.status(API_CODE.OK.code).send(response("Tokens revoked for user"));
    } else {
      res.status(API_CODE.OK.code).send(API_CODE.OK.message);
    }
  } catch (error) {
    potatoLogger.error(
      `IP ${req.ip} has failed to revoke token through ${req.method} via ${req.originalUrl} from ${req.headers["user-agent"]} ${error}`
    );
    return res
      .status(API_CODE.INTERNAL_SERVER_ERROR.code)
      .send(response(API_CODE.INTERNAL_SERVER_ERROR.message));
  }
});

router.patch("/api/user/:id", isAuthenticated, async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.update({
      where: {
        id: String(id),
      },
      data: req.body,
    });
    potatoLogger.info(
      `IP ${req.ip} has successfully updated user ${id} through ${req.method} via ${req.originalUrl} from ${req.headers["user-agent"]}`
    );
    res.json(product);
  } catch (error) {
    potatoLogger.error(
      `IP ${req.ip} has failed to update user ${id} through ${req.method} via ${req.originalUrl} from ${req.headers["user-agent"]} ${error}`
    );
    return res
      .status(API_CODE.INTERNAL_SERVER_ERROR.code)
      .send(response(API_CODE.INTERNAL_SERVER_ERROR.message));
  }
});

router.delete("/api/user/:id", isAuthenticated, async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedUser = await prisma.user.delete({
      where: { id: String(id) },
    });
    potatoLogger.warning(
      `IP ${req.ip} has deleted ${id} through ${req.method} via ${req.originalUrl} from ${req.headers["user-agent"]}`
    );
    res.json(deletedUser);
  } catch (error) {
    potatoLogger.error(
      `IP ${req.ip} has failed to delete ${id} through ${req.method} via ${req.originalUrl} from ${req.headers["user-agent"]} ${error}`
    );
    return res
      .status(API_CODE.INTERNAL_SERVER_ERROR.code)
      .send(response(API_CODE.INTERNAL_SERVER_ERROR.message));
  }
});

router.get("/api/isAuthenticated", isAuthenticated, async (req, res, next) => {
  try {
    let name = "";

    const { authorization } = req.headers;
    const token_session = authorization.split(" ")[1];
    let isTrue = jwt.verify(token_session, process.env.JWT_ACCESS_SECRET);
    if (isTrue) {
      var decoded = jwt.decode(token_session, { complete: true });
      let userId = decoded.payload.userId;
      const user = await findUserByIdFirst(userId);
      name = user.full_name;
      potatoLogger.info(
        `IP ${req.ip} has verified ${userId} through ${req.method} via ${req.originalUrl} from ${req.headers["user-agent"]}`
      );
      return res
        .status(API_CODE.OK.code)
        .send(response(API_CODE.OK.message, name));
    }
    potatoLogger.warning(
      `IP ${req.ip} has failed to verify ${id} through ${req.method} via ${req.originalUrl} from ${req.headers["user-agent"]} 401 Unauthorized`
    );
    return res
      .status(API_CODE.UNAUTHORIZED.code)
      .send(response(API_CODE.UNAUTHORIZED.message));
  } catch (error) {
    potatoLogger.error(
      `IP ${req.ip} has failed to verify ${id} through ${req.method} via ${req.originalUrl} from ${req.headers["user-agent"]} with error ${error}`
    );
    return res
      .status(API_CODE.INTERNAL_SERVER_ERROR.code)
      .send(response(API_CODE.INTERNAL_SERVER_ERROR.message));
  }
});

module.exports = router;
