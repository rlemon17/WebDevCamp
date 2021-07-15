const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res) => res.sendFile(__dirname + "/index.html"));

app.post("/", function(req, res) {
    var num1 = Number(req.body.num1);
    var num2 = Number(req.body.num2);
    res.send(`The sum is ${num1+num2}`);
});

app.get("/bmi", (req, res) => res.sendFile(__dirname + "/bmiCalculator.html"));

app.post("/bmi", function(req, res) {
    var weight = Number(req.body.weight);
    var height = Number(req.body.height);
    var bmi = (weight/(height*height))*703;
    res.send(`Your BMI is ${bmi}`);
})

app.listen(3000);