const express = require("express");
const path = require("path");

const app = express();

app.use(express.static(path.resolve(__dirname, "../rust/pkg")));
app.use(express.static(__dirname));

const port = 4000;

app.listen(port, () =>
  console.log(`Express server is running on localhost:${port}`)
);
