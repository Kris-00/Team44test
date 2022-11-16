import Express from "express";
const router = Express.Router();

var itemRouter = Express.Router({ strict: true });
// router.use('/:user', itemRouter);

router.get("/login", (req, res) => {
  res.render("Auth/signin");
});

router.post("/login", (req, res) => {
  res.render("Public/home");
});

router.get("/register", (req, res) => {
  res.render("Auth/signup");
});

router.get("/forget", (req, res) => {
  res.render("Auth/forget_pass");
});

router.get("/reset", (req, res) => {
  res.render("Auth/reset_pass");
});

export default router;
