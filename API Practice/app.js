const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const _ = require("lodash");

const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("index", {
        title: "Welcome!"
    });
})

app.post("/", (req, res) => {
    var query = req.body.pokeName;
    query = query.toLowerCase();
    const url = `https://pokeapi.co/api/v2/pokemon/${query}/`;
    const speciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${query}`;

    https.get(url, (res2) => {
        // Catch invalid entry
        if (res2.statusCode === 404) {
            res.render("index", {
                title: "ERROR: Invalid Search. Please try again:"
            });
        }

        else {
            let result = "";
            res2.on("data", (data) => {
                result += data;
            });
            res2.on("end", () => {
                const pokeData = JSON.parse(result);
                // Catch edge case of ? or other cases with an actual result
                if (!pokeData.forms) {
                    res.render("index", {
                        title: "ERROR: Invalid Search. Please try again:"
                    });
                    return;
                }
                const realName = _.capitalize(pokeData.forms[0].name);
                const hp = pokeData.stats[0].base_stat;
                const atk = pokeData.stats[1].base_stat;
                const def = pokeData.stats[2].base_stat;
                const spatk = pokeData.stats[3].base_stat;
                const spdef = pokeData.stats[4].base_stat;
                const spd = pokeData.stats[5].base_stat;
                const imgUrl = pokeData.sprites.front_default;
                res.render("pokemon", {
                    name: realName,
                    hp: hp,
                    atk: atk,
                    def: def,
                    spatk: spatk,
                    spdef: spdef,
                    spd: spd,
                    imgUrl: imgUrl
                });
            })
        } 
    })
})

app.listen(3000);