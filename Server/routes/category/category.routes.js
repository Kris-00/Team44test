const router = require("express").Router();
const { db } = require("../../utils/db");
const { isAuthenticated } = require("../../middlewares/auth");
const potatoLogger = require("../../middlewares/winston");
const jwt = require("jsonwebtoken");

router.get("/api/categories", async (req, res, next) => {
  try {
    const categories = await db.category.findMany({});
    res.json(categories);
    potatoLogger.info(
      `IP ${req.ip} has fetched all categories ${req.method} via ${req.originalUrl} from ${req.headers["user-agent"]}`
    );
  } catch (error) {
    potatoLogger.error(
      `IP ${req.ip} has failed to fetch all categories ${req.method} via ${req.originalUrl} from ${req.headers["user-agent"]} with error ${error}`
    );
  }
});

router.get("/api/categories/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await db.category.findUnique({
      where: {
        id: String(id),
      },
    });
    res.json(category);
    potatoLogger.info(
      `IP ${req.ip} has fetched a category ${id} ${req.method} via ${req.originalUrl} from ${req.headers["user-agent"]}`
    );
  } catch (error) {
    potatoLogger.error(
      `IP ${req.ip} has failed to fetch a category ${id} ${req.method} via ${req.originalUrl} from ${req.headers["user-agent"]} with error ${error}`
    );
    next(error);
  }
});

router.post("/api/categories", async (req, res, next) => {
  try {
    const category = await db.category.create({
      data: req.body,
    });
    res.json(category);
    potatoLogger.info(
      `IP ${req.ip} has created a category ${req.method} via ${req.originalUrl} from ${req.headers["user-agent"]}`
    );
  } catch (error) {
    potatoLogger.error(
      `IP ${req.ip} has failed to create a category ${req.method} via ${req.originalUrl} from ${req.headers["user-agent"]} with error ${error}`
    );
    next(error);
  }
});

router.patch("/api/categories/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await db.category.update({
      where: {
        id: String(id),
      },
      data: req.body,
    });
    res.json(category);
  } catch (error) {
    next(error);
  }
});

router.delete("/api/categories/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedCategory = await db.category.delete({
      where: { id: String(id) },
    });
    potatoLogger.warning(
      `IP ${req.ip} has deleted ${id} using ${req.method} via ${req.originalUrl} from ${req.headers["user-agent"]} has deleted category ${id}`
    );
    res.json(deletedCategory);
  } catch (error) {
    potatoLogger.error(
      `IP ${req.ip} has failed to delete ${id} using ${req.method} via ${req.originalUrl} from ${req.headers["user-agent"]} has failed to delete category ${id} with error ${error}`
    );
  }
});

module.exports = router;
