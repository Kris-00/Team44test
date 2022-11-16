import Express from "express";
import helmet from "helmet";
import dotenv from "dotenv";
import cors from "cors";
import AdminRoute from "./routes/adminRoute.js";
import UserProdRoute from "./routes/userProductRoute.js";
import AuthRoute from "./routes/authRoute.js";
import MemberRoute from "./routes/memberRoute.js";
import GeneralRoute from "./routes/generalRoute.js";
import ErrorRoute from "./routes/errorRoute.js";
import expressfileupload from "express-fileupload";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config({ path: ".env" });

const app = Express();
const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

app.use(expressfileupload());

app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "same-site",
    },
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

app.use(Express.static(path.join(__dirname, "/Views")));
app.set("views", path.join(__dirname, "Views"));
app.set("view engine", "ejs");
app.use(cors());
app.use(AdminRoute);
app.use(UserProdRoute);
app.use(AuthRoute);
app.use(MemberRoute);
app.use(GeneralRoute);
app.use(ErrorRoute);

app.get("/", (req, res) => {
  res.redirect("/home");
});

app.get("*", (req, res) => {
  res.render("Error/error404");
});

app.listen(process.env.CLIENT_PORT, "0.0.0.0", () => {});
