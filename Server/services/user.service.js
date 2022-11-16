const bcrypt = require("bcrypt");
const { db } = require("../utils/db");

function findUserByEmail(email) {
  return db.user.findUnique({
    where: {
      email: email,
    },
  });
}

function findUserById(id) {
  return db.user.findUnique({
    where: {
      id: id,
    },
  });
}

function findUserByIdFirst(id) {
  return db.user.findFirst({
    where: {
      id: id,
    },
  });
}

function createUserByEmailAndPassword(user) {
  user.password = bcrypt.hashSync(user.password, 10);
  return db.user.create({
    data: {
      full_name: user.full_name,
      email: user.email,
      phone: user.phone,
      password: user.password,
    },
  });
}

function createAdminByEmailAndPassword(user) {
  user.password = bcrypt.hashSync(user.password, 10);
  return db.user.create({
    data: {
      full_name: user.full_name,
      email: user.email,
      phone: user.phone,
      password: user.password,
      account_status: user.status,
      user_role: user.user_role,
    },
  });
}

function findUserById(id) {
  return db.user.findFirst({
    where: {
      id: id,
    },
  });
}

module.exports = {
  findUserByEmail,
  findUserById,
  createUserByEmailAndPassword,
  createAdminByEmailAndPassword,
  findUserById,
  findUserByIdFirst,
};
