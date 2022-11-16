import Express from "express"
const router = Express.Router();

var itemRouter = Express.Router({ strict: true });
// router.use('/:user', itemRouter);

router.get("/home",(req,res)=>{
    res.render("Public/home");
})

router.get("/about",(req,res)=>{
    res.render("Public/about");
})

router.get("/contact",(req,res)=>{
    res.render("Public/contact");
})

export default router;
