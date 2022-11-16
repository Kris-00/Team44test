const { db } = require("../utils/db");

function findAllProduct() {
  return db.cart.findMany({});
}

function findProductById(id) {
  return db.product.findUnique({
    where: {
      id: id,
    },
  });
}
module.exports = {
  findAllProduct,
  findProductById,
};
