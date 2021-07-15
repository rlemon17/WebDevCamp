const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
})

app.post("/", (req, res) => {
    const query = req.body.cityName;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=24a72b09deb5be68d63ca797cc959f21&units=imperial`;

    // Retrieve API data from site, and parse the object for specific data
    https.get(url, (res2) => {
        //console.log(res2);
        res2.on("data", (data) => {
            const weatherData = JSON.parse(data);

            const desc = weatherData.weather[0].description;
            const temp = weatherData.main.temp;
            const icon = weatherData.weather[0].icon;

            res.write(`<h1>The temperature in ${query} is ${temp} degrees Fahrenheit</h1>`);
            res.write(`<p>The weather is currently ${desc}.</p>`);
            res.write(`<img src=http://openweathermap.org/img/wn/${icon}@2x.png style="background-color: black">`)
            res.send();
        })
    })
})

app.listen(3000);

