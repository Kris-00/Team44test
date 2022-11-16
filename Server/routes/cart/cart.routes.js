const router = require("express").Router();
const { db } = require("../../utils/db");
const jwt = require("jsonwebtoken");
const validate = require("validator");
const { API_CODE, response } = require("../../utils/response/response.js");
const e = require("express");
const {
  findAllCart,
  findAllCartById,
  findCartById,
  addToCart,
  updateToCart,
  removeAllItemInCartByUserId,
} = require("../../services/cart.service");

const {
  findAllProduct,
  findProductById,
} = require("../../services/product.service");
const { isAuthenticated } = require("../../middlewares/auth");
const { json } = require("express");
const potatoLogger = require("../../middlewares/winston");

router.get("/api/cart", isAuthenticated, async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    const token_session = authorization.split(" ")[1];
    const payload = jwt.verify(token_session, process.env.JWT_ACCESS_SECRET);
    let isTrue;
    try {
      isTrue = jwt.verify(token_session, process.env.JWT_ACCESS_SECRET);
      potatoLogger.info(
        `IP ${req.ip} with ID ${payload.user_id} has retrieved ${req.method} via ${req.originalUrl} from ${req.headers["user-agent"]} - ${isTrue}`
      );
    } catch (error) {
      potatoLogger.info(
        `IP ${req.ip} with ID ${payload.user_id} has retrieved ${req.method} via ${req.originalUrl} from ${req.headers["user-agent"]} Invalid token 401 Unauthorized ${error}`
      );
      return res
        .status(API_CODE.UNAUTHORIZED.code)
        .send(response(API_CODE.UNAUTHORIZED.message));
    }
    if (isTrue) {
      var decoded = jwt.decode(token_session, { complete: true });
      let userId = decoded.payload.userId;
      let user_cart = await findAllCartById(userId);
      delete user_cart["user_id"];
      if (user_cart.length < 0) {
        return res
          .status(API_CODE.NO_CONTENT.code)
          .send(response("No item in your carts."));
      }
      potatoLogger.info(
        `IP ${req.ip} with ID ${payload.user_id} has deleted cart ${req.method} via ${req.originalUrl} from ${req.headers["user-agent"]} 200 OK`
      );
      return res
        .status(API_CODE.OK.code)
        .send(response(API_CODE.OK.message, user_cart));
    }
    potatoLogger.warning(
      `IP ${req.ip} with ID ${payload.user_id} has retrieved ${req.method} via ${req.originalUrl} from ${req.headers["user-agent"]} 401 Unauthorized`
    );
    return res
      .status(API_CODE.UNAUTHORIZED.code)
      .send(response(API_CODE.UNAUTHORIZED.message));
  } catch (error) {
    potatoLogger.warning(`Internal server error 500 ${error}`);
    return res
      .status(API_CODE.INTERNAL_SERVER_ERROR.code)
      .send(response(API_CODE.INTERNAL_SERVER_ERROR.message));
  }
});

router.post("/api/carts/:id", isAuthenticated, async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    let data = {};
    const req_prod_id = req.params.id;
    let qty = 1;

    if (!validate.isUUID(req_prod_id) || isNaN(qty)) {
      potatoLogger.warning(
        `IP ${req.ip} with ID ${payload.user_id} has retrieved ${req.method} via ${req.originalUrl} from ${req.headers["user-agent"]} 400 Bad Request`
      );
      return res.status(API_CODE.BAD_REQUEST.code).send(response("Invalid!"));
    }
    const p_id = validate.escape(req_prod_id);
    const token_session = authorization.split(" ")[1];

    let isTrue = jwt.verify(token_session, process.env.JWT_ACCESS_SECRET);
    if (isTrue) {
      var decoded = jwt.decode(token_session, { complete: true });

      let userId = decoded.payload.userId;
      var product = await findProductById(p_id);
      potatoLogger.info(
        `IP ${req.ip} with ID ${userId} has retrieved ${req.method} via ${req.originalUrl} from ${req.headers["user-agent"]} 200 OK`
      );
      if (!product) {
        return res
          .status(API_CODE.BAD_REQUEST.code)
          .send(response("The product no longer available."));
      }

      if (product.stock < qty) {
        return res
          .status(API_CODE.BAD_REQUEST.code)
          .send(
            response(
              "The product low in stock. Could only add for " +
                product.stock +
                " ea."
            )
          );
      }
      const users_cart = await db.cart.findFirst({
        where: {
          user_id: userId,
          product_id: p_id,
        },
      });
      potatoLogger.info(
        `IP ${req.ip} with ID ${userId} has retrieved ${req.method} via ${req.originalUrl} from ${req.headers["user-agent"]} 200 OK`
      );

      if (!users_cart) {
        data = {
          user_id: userId,
          product_id: p_id,
          quantity: parseInt(qty),
          subTotal: product.price,
        };
        await addToCart(data);
        potatoLogger.info(
          `IP ${req.ip} with ID ${userId} has added ${req.method} via ${req.originalUrl} from ${req.headers["user-agent"]} 200 OK`
        );
        return res.status(API_CODE.OK.code).send(response(API_CODE.OK.message));
      } else {
        users_cart.quantity += parseInt(qty);
        users_cart.subtotal =
          parseFloat(users_cart.subtotal) + parseFloat(product.price);
        if (product.stock > users_cart.quantity) {
          potatoLogger.info(
            `IP ${req.ip} with ID ${userId} has updated ${req.method} via ${req.originalUrl} from ${req.headers["user-agent"]} 200 OK`
          );
          await updateToCart(users_cart);
          return res
            .status(API_CODE.OK.code)
            .send(response(API_CODE.OK.message));
        }
        potatoLogger.warning(
          `IP ${req.ip} with ID ${userId} has updated ${req.method} via ${req.originalUrl} from ${req.headers["user-agent"]} 400 BAD REQUEST`
        );
        return res
          .status(API_CODE.BAD_REQUEST.code)
          .send(response(API_CODE.BAD_REQUEST.message));
      }
    }
  } catch (error) {
    potatoLogger.warning(`Internal server error 500 ${error}`);
    return res
      .status(API_CODE.INTERNAL_SERVER_ERROR.code)
      .send(response(API_CODE.INTERNAL_SERVER_ERROR.message));
  }
});

router.delete("/api/cart", isAuthenticated, async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    const token_session = authorization.split(" ")[1];
    let isTrue = jwt.verify(token_session, process.env.JWT_ACCESS_SECRET);
    if (isTrue) {
      var decoded = jwt.decode(token_session, { complete: true });
      let userId = decoded.payload.userId;

      await removeAllItemInCartByUserId(userId);
      potatoLogger.info(
        `IP ${req.ip} with ID ${userId} has deleted everything ${req.method} via ${req.originalUrl} from ${req.headers["user-agent"]} 200 OK`
      );

      return res.status(API_CODE.OK.code).send(response(API_CODE.OK.message));
    }
  } catch (error) {
    potatoLogger.error(`Internal server error 500 ${error}`);
    return res
      .status(API_CODE.INTERNAL_SERVER_ERROR.code)
      .send(response(API_CODE.INTERNAL_SERVER_ERROR.message));
  }
});

//DELETE One Product
router.delete("/api/cart/:id", isAuthenticated, async (req, res, next) => {
  try {
    var prod_id = req.params.id;
    const { authorization } = req.headers;
    const token_session = authorization.split(" ")[1];

    let isTrue = jwt.verify(token_session, process.env.JWT_ACCESS_SECRET);
    if (isTrue) {
      var decoded = jwt.decode(token_session, { complete: true });

      let userId = decoded.payload.userId;

      let rs = await db.cart.deleteMany({
        where: { user_id: userId, product_id: prod_id },
      });
      potatoLogger.info(
        `IP ${req.ip} with ID ${userId} has deleted ${req.method} via ${req.originalUrl} from ${req.headers["user-agent"]} 200 OK`
      );
      return res.status(API_CODE.OK.code).send(response(API_CODE.OK.message));
    }
  } catch (error) {
    potatoLogger.error(`Internal server error 500 ${error}`);
    return res
      .status(API_CODE.INTERNAL_SERVER_ERROR.code)
      .send(response(API_CODE.INTERNAL_SERVER_ERROR.message));
  }
});

//checkout cart
router.get("/api/cart/checkout/", async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    const token_session = authorization.split(" ")[1];

    let isTrue;
    try {
      isTrue = jwt.verify(token_session, process.env.JWT_ACCESS_SECRET);
    } catch (error) {
      potatoLogger.error(`Unauthorized error 401 ${error}`);
      return res
        .status(API_CODE.UNAUTHORIZED.code)
        .send(response(API_CODE.UNAUTHORIZED.message));
    }
    if (isTrue) {
      var decoded = jwt.decode(token_session, { complete: true });
      let userId = decoded.payload.userId;

      let user_cart = await findAllCartById(userId);
      delete user_cart["user_id"];
      if (user_cart.length < 0) {
        potatoLogger.error(
          `IP ${req.ip} with ID ${userId} ${req.method} via ${req.originalUrl} from ${req.headers["user-agent"]} 204 NO CONTENT`
        );
        return res
          .status(API_CODE.NO_CONTENT.code)
          .send(response("No item in your carts."));
      }

      var result = user_cart.map((a) => a.subtotal);

      potatoLogger.info(
        `IP ${req.ip} with ID ${userId} has retrieved ${req.method} via ${req.originalUrl} from ${req.headers["user-agent"]} 200 OK`
      );
      return res
        .status(API_CODE.OK.code)
        .send(response(API_CODE.OK.message, result));
    }
  } catch (error) {
    potatoLogger.error(`Internal server error 500 ${error}`);
    return res
      .status(API_CODE.INTERNAL_SERVER_ERROR.code)
      .send(response(API_CODE.INTERNAL_SERVER_ERROR.message));
  }
});

//checkout cart
router.post("/api/cart/checkout/", isAuthenticated, async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    const token_session = authorization.split(" ")[1];
    let isTrue;
    try {
      isTrue = jwt.verify(token_session, process.env.JWT_ACCESS_SECRET);
    } catch (error) {
      potatoLogger.error(`Unauthorized error 401 ${error}`);
      return res
        .status(API_CODE.UNAUTHORIZED.code)
        .send(response(API_CODE.UNAUTHORIZED.message));
    }
    if (isTrue) {
      var decoded = jwt.decode(token_session, { complete: true });
      let userId = decoded.payload.userId;

      await removeAllItemInCartByUserId(userId);
      potatoLogger.info(
        `IP ${req.ip} with ID ${userId} has checked out ${req.method} via ${req.originalUrl} from ${req.headers["user-agent"]} 200 OK`
      );
      return res.status(API_CODE.OK.code).send(response(API_CODE.OK.message));
    }
  } catch (error) {
    potatoLogger.error(`Internal server error 500 ${error}`);
    return res
      .status(API_CODE.INTERNAL_SERVER_ERROR.code)
      .send(response(API_CODE.INTERNAL_SERVER_ERROR.message));
  }
});

module.exports = router;
