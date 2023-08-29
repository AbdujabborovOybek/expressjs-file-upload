const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 8080;
const multer = require("multer");
const cripto = require("crypto");
const sharp = require("sharp");

app.use(cors());
app.use(express.json());
app.use("/img", express.static("img"));

app.get("/", (req, res) => res.status(200).send("Server is running!"));

// ###### Fayl yuklashning 1-usuli ######
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./img");
//   },

//   filename: function (req, file, cb) {
//     const format = file?.originalname.split(".").pop();
//     const name = cripto.randomBytes(4).toString("hex");

//     cb(null, `g2_${name}.${format}`);
//   },
// });
// const upload = multer({ storage }).single("img");

// ##### Fayl yuklashning 2-usuli #####

const file = multer().single("img");

app.post("/file/upload", [file], async (req, res) => {
  const format = req.file?.originalname.split(".").pop();
  const unique = cripto.randomBytes(5).toString("hex");
  const fileName = `g2_${unique}.${format}`;
  const url = `http://${req.headers.host}/img/${fileName}`;

  const buffer = await req.file?.buffer;
  await sharp(buffer).resize(450, 450).toFile(`./img/${fileName}`);

  res.status(200).json({
    status: true,
    message: "File saved!",
    data: {
      fileName,
      format,
      url,
    },
  });
});

app.listen(port, () => console.log(`Server started on port ${port}`));
