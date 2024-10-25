const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { default: mongoose } = require("mongoose");
const multer = require("multer");
const cookieParser = require("cookie-parser");
const routes = require("./routes");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
app.use(bodyParser.json());
app.use(cors({
  origin: '*', 
  credentials: true, 
}));

app.use(cookieParser());
app.use("/api", routes);

mongoose.set("strictQuery", true);
mongoose
  .connect(
    process.env.MONGO_DB,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => {
    console.error("Could not connect to MongoDB:", err);
  });

app.listen(port, () => {
  console.log("Server is running in port: ", +port);
});