import express from "express";

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("hello world buda");
});

app.listen(port, () => {
  console.log(`Hello world app listening on port ${port}`);
});
