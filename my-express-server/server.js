const express = require('express');
const app = express();

app.get("/", (req, res) => res.send("hello"));
app.get("/about", (req, res) => res.send("i cat dad"));
app.get("/hobbies", (req, res) => res.send("test"));
app.listen(3000, () => console.log("server started"));