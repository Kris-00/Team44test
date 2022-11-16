const router = require("express").Router();
const { db } = require("../../utils/db");
const { isAuthenticated } = require("../../middlewares/auth");
const potatoLogger = require("../../middlewares/winston");

router.get("/api/order", async (req, res, next) => {
  try {
    const orders = await db.order.findMany({});
    res.json(orders);
    potatoLogger.info(
      `IP ${req.ip} has fetched all orders ${req.method} via ${req.originalUrl} from ${req.headers["user-agent"]}`
    );
  } catch (error) {
    potatoLogger.error(
      `IP ${req.ip} has failed to fetch all orders ${req.method} via ${req.originalUrl} from ${req.headers["user-agent"]} with error ${error}`
    );
    next(error);
  }
});

router.get("/api/order/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await db.order.findUnique({
      where: {
        id: String(id),
      },
    });
    res.json(order);
    potatoLogger.info(
      `IP ${req.ip} has fetched an order ${id} ${req.method} via ${req.originalUrl} from ${req.headers["user-agent"]}`
    );
  } catch (error) {
    potatoLogger.error(
      `IP ${req.ip} has failed to fetch an order ${id} ${req.method} via ${req.originalUrl} from ${req.headers["user-agent"]} with error ${error}`
    );
    next(error);
  }
});

router.post("/api/order/:id", async (req, res, next) => {
  try {
    const array = [];
    for (let i = 0; i < req.body.products.length; i++) {
      req.body.productsprice += req.body.products[i].price;
      const order = await db.order.create({
        data: {
          user_id: req.params.id,
          product_id: req.body.products[i].product_id,
          quantity: req.body.products[i].quantity,
          total_price: req.body.products.price,
        },
      });
      array.push(order);
    }
    res.send(array);
    potatoLogger.info(
      `IP ${req.ip} has created an order ${req.method} via ${req.originalUrl} from ${req.headers["user-agent"]}`
    );
  } catch (error) {
    potatoLogger.error(
      `IP ${req.ip} has failed to create an order ${req.method} via ${req.originalUrl} from ${req.headers["user-agent"]} with error ${error}`
    );
    next(error);
  }
});

router.patch("/api/order/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await db.order.update({
      where: {
        id: String(id),
      },
      data: req.body,
    });
    res.json(order);
    potatoLogger.info(
      `IP ${req.ip} has updated an order ${id} ${req.method} via ${req.originalUrl} from ${req.headers["user-agent"]}`
    );
  } catch (error) {
    potatoLogger.error(
      `IP ${req.ip} has failed to update an order ${id} ${req.method} via ${req.originalUrl} from ${req.headers["user-agent"]} with error ${error}`
    );
    next(error);
  }
});

module.exports = router;
