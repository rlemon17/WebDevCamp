const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const express = require("express");

const app = express();

app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true, useUnifiedTopology: true});

const articleSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Article = new mongoose.model("Article", articleSchema);

// Condensed to chain methods
app.route("/articles")

    .get((req, res) => {
        Article.find((err, result) => {
            if (!err) {
                res.send(result);
            }
            else {
                res.send(err);
            }
        })
    })

    .post((req, res) => {
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });
    
        newArticle.save((err) => {
            if (!err) {
                res.send("Add successful");
            }
            else {
                res.send(err);
            }
        });
    })

    .delete((req, res) => {
        Article.deleteMany((err) => {
            if (!err) {
                res.send("Successfully deleted all");
            }
            else {
                res.send(err);
            }
        });
    });

app.route("/articles/:title")

    .get((req, res) => {
        Article.findOne({title: req.params.title}, (err, result) => {
            if (result) {
                res.send(result);
            }
            else {
                res.send("No article found");
            }
        });
    })

    .put((req, res) => {
        Article.update(
            {title: req.params.title},   //Conditions
            {                            //The updates
                title: req.body.title,
                content: req.body.content
            },                    
            {overwrite: true},           //Overwrite entire doc
            (err) => {           //Callback
                if (!err) {
                    res.send("Successfully updated");
                }
            }
        );
    })

    .patch((req, res) => {
        Article.update(
            {title: req.params.title},
            {$set: req.body},
            (err) => {
                if (!err) {
                    res.send("Successfully updated requested parameters")
                }
            }
        );
    })

    .delete((req, res) => {
        Article.deleteOne({title: req.params.title}, (err) => {
            if (!err) {
                res.send("Successfully deleted requested doc");
            }
            else {
                res.send(err);
            }
        });
    });

app.listen(3000);