const express = require("express");
const cors = require("cors");
const path = require("path");
const fileUpload = require("express-fileupload");
const fileSizeLimiterMW = require("./middlewares/fileSizeLimiterMW");
const fileExtLimiterMW = require("./middlewares/fileExtLimiterMW");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: "true" }));
app.use(express.static("files"))

app.use(cors());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});
app.post(
  "/upload",
  fileUpload({ createParentPath: true }),
  fileExtLimiterMW([".png", ".jpg", ".jpeg"]),
  fileSizeLimiterMW,
  (req, res) => {
    let files = req.files;
    Object.keys(files).forEach((key) => {
      let filePath = path.join(__dirname, "diles", files[key].name);
      files[key].mv(filePath, (err) => {
        if (err) return res.status(500).json({ msg: err });
      });
    });
    res.json({ msg: "files uploaded" });
  }
);

app.listen(process.env.PORT || 3000, () => {
  console.log("server connected");
});
