import Express from "express";
const router = Express.Router();
import axios from "axios";

var itemRouter = Express.Router({ strict: true });
// router.use('/:user', itemRouter);

router.get("/cart/:id", (req, res) => {
  res.render("Public/home");
});

router.post("/cart/:id", (req, res) => {
  res.render("Public/home");
});

export default router;
