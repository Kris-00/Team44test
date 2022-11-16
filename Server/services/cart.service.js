const { db } = require("../utils/db");

function findAllCart() {
  return db.cart.findMany({});
}

function findAllCartById(id) {
  return db.cart.findMany({
    where: {
      user_id: id,
    },
    include: {
      product: true,
    },
  });
}

function findCartById(id) {
  return db.cart.findUnique({
    where: {
      user_id: id,
    },
  });
}

async function addToCart(data) {
  return db.cart.create({
    data: {
      user_id: data.user_id,
      product_id: data.product_id,
      quantity: data.quantity,
      subtotal: data.subTotal,
    },
  });
}

function updateToCart(data) {
  return db.cart.update({
    where: {
      id: data.id,
    },
    data: {
      quantity: data.quantity,
      subtotal: data.subtotal,
    },
  });
}

function removeAllItemInCartByUserId(id) {
  return db.cart.deleteMany({
    where: {
      user_id: id,
    },
  });
}

module.exports = {
  findAllCart,
  findAllCartById,
  findCartById,
  addToCart,
  updateToCart,
  removeAllItemInCartByUserId,
};
