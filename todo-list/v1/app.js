const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");

const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

// Tells app to use ejs as view engine
app.set("view engine", "ejs");

let newItems = [];
let workItems = [];

app.get("/", (req, res) => {

    let day = date.getDate();

    res.render("list", {
        listTitle: day,
        newListItems: newItems
    });

});

app.post("/", (req, res) => {

    let newItem = req.body.newItem;

    if (req.body.list === "Work") {
        workItems.push(newItem);
        res.redirect("/work");
    }

    else {
        newItems.push(newItem);
        res.redirect("/");
    }
    
});

app.get("/work", (req, res) => {
    res.render("list", {
        listTitle: "Work",
        newListItems: workItems
    });
});

app.post("/work", (req, res) => {
    let newItem = req.body.newItem;
    workItems.push(newItem);
    res.redirect("/work");
});

app.get("/about", (req, res) => {
    res.render("about");
});

app.listen(3000);