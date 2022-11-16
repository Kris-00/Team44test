const router = require("express").Router();
const { db } = require("../../utils/db");
const { isAuthenticated } = require("../../middlewares/auth");

const cloudinary = require("../../utils/cloudinary");
const upload = require("../../middlewares/multer");
const potatoLogger = require("../../middlewares/winston");

router.get("/api/products", isAuthenticated, async (req, res, next) => {
  try {
    const products = await db.product.findMany({
      include: {
        category: true,
      },
    });
    potatoLogger.info(
      `IP ${req.ip} has fetched all products ${req.method} via ${req.originalUrl} from ${req.headers["user-agent"]}`
    );
    res.json(products);
  } catch (err) {
    potatoLogger.error(
      `IP ${req.ip} has failed to fetch all products ${req.method} via ${req.originalUrl} from ${req.headers["user-agent"]} with error ${err}`
    );
    next(err);
  }
});

router.get("/api/productsList", async (req, res, next) => {
  try {
    const products = await db.product.findMany({
      include: {
        category: true,
      },
    });
    potatoLogger.info(
      `IP ${req.ip} has fetched all products ${req.method} via ${req.originalUrl} from ${req.headers["user-agent"]}`
    );
    res.json(products);
  } catch (err) {
    potatoLogger.error(
      `IP ${req.ip} has failed to fetch all products ${req.method} via ${req.originalUrl} from ${req.headers["user-agent"]} with error ${err}`
    );
    next(err);
  }
});

router.get("/api/products/:id", isAuthenticated, async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await db.product.findUnique({
      where: {
        id: String(id),
      },
    });
    potatoLogger.info(
      `IP ${req.ip} has fetched a product ${id} ${req.method} via ${req.originalUrl} from ${req.headers["user-agent"]}`
    );
    res.json(product);
  } catch (err) {
    potatoLogger.error(
      `IP ${req.ip} has failed to fetch a product ${id} ${req.method} via ${req.originalUrl} from ${req.headers["user-agent"]} with error ${err}`
    );
    next(err);
  }
});

router.post(
  "/api/products",
  upload.single("image_url"),
  async function (req, res, next) {
    const cloudResult = await cloudinary.uploader.upload(req.file.path, {
      public_id: new Date().toISOString() + req.file.originalname,
      folder: "images",
    });
    try {
      const product = await db.product.create({
        data: {
          name: req.body.name,
          image_url: String(cloudResult.secure_url),
          price: parseInt(req.body.price),
          description: req.body.description,
          stock: parseInt(req.body.stock),
          product_code: req.body.product_code,
          public_id: String(cloudResult.public_id),
          category_name: req.body.category,
        },
      });
      potatoLogger.warning(
        `IP ${req.ip} has created a product ${req.method} via ${req.originalUrl} from ${req.headers["user-agent"]}`
      );
      res.json(product);
    } catch (err) {
      potatoLogger.error(
        `IP ${req.ip} has failed to create a product ${req.method} via ${req.originalUrl} from ${req.headers["user-agent"]} with error ${err}`
      );
      next(err);
    }
  }
);

router.delete(
  "/api/products/:id",
  isAuthenticated,
  async function (req, res, next) {
    try {
      const { id } = req.params;
      const product = await db.product.findUnique({
        where: {
          id: String(id),
        },
      });
      const result = await cloudinary.uploader.destroy(product.public_id);
      const deletedProduct = await db.product.delete({
        where: {
          id: String(id),
        },
      });
      potatoLogger.warning(
        `IP ${req.ip} has deleted a product ${id} ${req.method} via ${req.originalUrl} from ${req.headers["user-agent"]}`
      );
      res.json(deletedProduct);
    } catch (err) {
      potatoLogger.error(
        `IP ${req.ip} has failed to delete a product ${id} ${req.method} via ${req.originalUrl} from ${req.headers["user-agent"]} with error ${err}`
      );
      next(err);
    }
  }
);

module.exports = router;
