const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();

app.use(bodyParser.urlencoded({extended:true}));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
})

app.get("/index.html", (req, res) => {
    res.sendFile(__dirname + "/index.html");
})

app.post("/", (req, res) => {
    var query = req.body.pokeName;
    query = query.toLowerCase();
    const url = `https://pokeapi.co/api/v2/pokemon/${query}/`;

    https.get(url, (res2) => {
        let result = "";
        res2.on("data", (data) => {
            result += data;
        });
        res2.on("end", () => {
            const pokeData = JSON.parse(result);
            const realName = pokeData.forms[0].name;
            const hp = pokeData.stats[0].base_stat;
            const atk = pokeData.stats[1].base_stat;
            const def = pokeData.stats[2].base_stat;
            const spatk = pokeData.stats[3].base_stat;
            const spdef = pokeData.stats[4].base_stat;
            const spd = pokeData.stats[5].base_stat;
            res.write(`<style>
            body {
                background-color: black;
                color: white;
                font-family: "Helvetica", sans-serif;
                font-weight: bold;
                text-align: center;
            }
            </style>`);
            res.write(`<h1>${realName}</h1>`)
            res.write(`<p style="color:red;">HP: ${hp}</p>`);
            res.write(`<p style="color:orange;">ATK: ${atk}</p>`);
            res.write(`<p style="color:yellow;">DEF: ${def}</p>`);
            res.write(`<p style="color:blue;">SP. ATK: ${spatk}</p>`);
            res.write(`<p style="color:green;">SP. DEF ${spdef}</p>`);
            res.write(`<p style="color:pink">SPD: ${spd}</p>`);
            res.send();
        })
        
    })

    //How do I do it this way??? :(((
    //res.sendFile(__dirname + "/index2.html");
})

app.listen(3000);