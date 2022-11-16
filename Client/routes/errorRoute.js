import Express from "express";
const router = Express.Router();

router.get("/error404", (req, res) => {
  res.render("Error/error404");
});

router.get("/error500", (req, res) => {
  res.render("Error/error500");
});

router.get("/error400", (req, res) => {
  res.render("Error/error400");
});

router.get("/error401", (req, res) => {
  res.render("Error/error401");
});

export default router;
