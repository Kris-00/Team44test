import Express from "express";
// import { getAllProducts } from "../index.js";

const router = Express.Router();
import axios from "axios";
import FormData from "form-data";

router.get("/admin/", (req, res) => {
  res.render("Admin/product_list");
});

router.get("/admin/accounts", (req, res) => {
  res.render("Admin/accounts");
});

router.get("/admin/createAccount", (req, res) => {
  res.render("Admin/create_account");
});

router.get("/admin/createProduct", (req, res) => {
  axios
    .get("http://128.199.129.228:3000/api/categories/", {
      withCredentials: true,
    })
    .then((response) => {
      const cat_list = response;
      res.render("admin/create_product", { cat_list: cat_list.data });
    });
});

router.post("/admin/createProduct", (req, res) => {
  let buffer = Buffer.from(req.files.upload.data);
  var form = new FormData();
  form.append("name", String(req.body.name));
  form.append("price", parseInt(req.body.price));
  form.append("stock", parseInt(req.body.stock));
  form.append("description", String(req.body.description));
  form.append("image_url", buffer, String(req.files.upload.name));
  form.append("product_code", String(req.body.product_code));
  form.append("category", String(req.body.category));

  axios
    .post("http://getdrunk.ml/api/products", form, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then(function (response) {
      res.redirect("/admin/products");
    })
    .catch(function (error) {});
});

router.get("/admin/products/:id", async (req, res) => {
  let prod_id = req.params.id;
  res.render("Admin/product_list", { itemID: prod_id, isDel: true });
});

router.get("/admin/products", async (req, res) => {
  res.render("Admin/product_list");
});

router.get("/admin/products/:id", async (req, res) => {
  let prod_id = req.params.id;
  res.render("Admin/product_list", { itemID: prod_id, isDel: true });
});

export default router;
