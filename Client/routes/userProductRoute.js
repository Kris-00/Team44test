import Express from "express";
const router = Express.Router();

var itemRouter = Express.Router({ strict: true });
// router.use('/:user', itemRouter);

router.get("/member/cart", (req, res) => {
  res.render("Member/carts");
});

router.get("/member/payment", (req, res) => {
  res.render("Member/payment");
});

router.get("/member/clearCart", (req, res) => {
  res.render("Member/carts");
});

router.get("/member/cart/:id", async (req, res) => {
  const id = req.params.id;
  res.render("Member/carts");
});

export default router;
