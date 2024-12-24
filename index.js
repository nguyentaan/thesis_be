const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { default: mongoose } = require("mongoose");
const multer = require("multer");
const cookieParser = require("cookie-parser");
const routes = require("./routes");
const dotenv = require("dotenv");
const AuthenticateRouter = require("./routes/authenticate");
const ProductRouter = require("./routes/product");
const CartRouter = require("./routes/cartRoutes");
const OrderRouter = require("./routes/orderRoutes");
const UserRouter = require("./routes/user");
const ReviewRouter = require("./routes/reviewRoutes");
const FileUploadRouter = require("./routes/fileUpload");

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

//Middleware
app.use(bodyParser.json());
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);


//Routes
app.use(cookieParser());
app.use("/api/auth", AuthenticateRouter);
app.use("/api/products", ProductRouter);
app.use("/api/cart", CartRouter);
app.use("/api/order", OrderRouter);
app.use("/api/user", UserRouter);
app.use("/api/review", ReviewRouter);
app.use("/api/files", FileUploadRouter);

//app.use("/api", routes);
// routes(app);

//MongoDB connection
mongoose.set("strictQuery", true);
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => {
    console.error("Could not connect to MongoDB:", err);
  });

app.listen(port, () => {
  console.log("Server is running in port: ", +port);
});
