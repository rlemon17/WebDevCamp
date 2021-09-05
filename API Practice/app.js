const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const _ = require("lodash");

const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

// ========================== Home Page ==========================
app.get("/", (req, res) => {
    res.render("home")
});

// ========================== Pokemon ==========================
app.get("/pokemon", (req, res) => {
    res.render("index", {
        title: "Welcome!"
    });
})

app.post("/pokemon", (req, res) => {
    var query = req.body.pokeName;
    query = query.toLowerCase();
    var speciesQuery = query;
    
    if (query.includes("-")) {
        speciesQuery = query.substring(0, query.indexOf("-"));
    }

    // For meelo!
    if (query === "meelo") {
        res.render("pokemon", {
            name: "Meelo",
            hp: 55,
            atk: 45,
            def: 50,
            spatk: 25,
            spdef: 25,
            spd: 95,
            imgUrl: "meeloWalk.gif",
            dexEntry: "MEELO, also known as the cutest and goodest boi, was adopted on October 12, 2017. He enjoys eating, sleeping, and being held like a baby. Legend says he begins to yell at the first sight of sunlight.",
            types: "Normal, Fire",
            hasForms: false,
            formsList: []
        });
        return;
    }

    const url = `https://pokeapi.co/api/v2/pokemon/${query}/`;
    const speciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${speciesQuery}`;

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

                // Go through Speecies API next
                https.get(speciesUrl, (res3) => {
                    let result2 = "";
                    res3.on("data", (data2) => {
                        result2 += data2;
                    });
                    res3.on("end", () => {
                        const speciesData = JSON.parse(result2);

                        // Just return the first English entry
                        const findEntry = speciesData.flavor_text_entries.find((entry) => entry.language.name == "en");
                        const dexEntry = findEntry.flavor_text;

                        // Check for forms
                        let hasForms = false;
                        let formsList = [];
                        if (speciesData.varieties.length > 1) {
                            hasForms = true;
                            formsList = speciesData.varieties;
                        }

                        // Data from the pokeData pull
                        // Text
                        const realName = _.capitalize(pokeData.forms[0].name);
                        const types = pokeData.types.map(obj => " " + _.capitalize(obj.type.name) + " ");

                        // Stats
                        const hp = pokeData.stats[0].base_stat;
                        const atk = pokeData.stats[1].base_stat;
                        const def = pokeData.stats[2].base_stat;
                        const spatk = pokeData.stats[3].base_stat;
                        const spdef = pokeData.stats[4].base_stat;
                        const spd = pokeData.stats[5].base_stat;

                        // Sprite
                        const imgUrl = pokeData.sprites.front_default;

                        res.render("pokemon", {
                            name: realName,
                            hp: hp,
                            atk: atk,
                            def: def,
                            spatk: spatk,
                            spdef: spdef,
                            spd: spd,
                            imgUrl: imgUrl,
                            dexEntry: dexEntry,
                            types: types,
                            hasForms: hasForms,
                            formsList: formsList
                        });
                    })
                });
            })
        } 
    })
})

app.listen(3000);