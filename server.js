const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const mongoose = require("mongoose");

const routes = require("./routes");

const app = express();

const port = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

mongoose.set("strictQuery", true);
mongoose.connect(
  MONGO_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (!err) console.log("Succesfully connected to DB!");
    else console.log("Could not connect to DB!");
  }
);

app.use("/api", routes);

app.use(express.static(path.join(__dirname, "build")));

app.get("/*", function (_, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(port, () => console.log(`Server started on port ${port}`));
