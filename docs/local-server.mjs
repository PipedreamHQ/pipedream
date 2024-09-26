import express from "express";
const app = express();

app.use("/docs", express.static("docs/.vuepress/dist"));
app.use("/", express.static("docs/.vuepress/dist"));

app.listen(8000);
