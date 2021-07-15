const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');

const app = express();

// Do this to grab input from forms!!!
app.use(bodyParser.urlencoded({extended: true}));

// To use local files
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/signup.html");
})

app.post("/", (req, res) => {
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var email = req.body.email;

    var data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    var jsonData = JSON.stringify(data);
     
    const url = "https://us6.api.mailchimp.com/3.0/lists/e1048ba47e";
    const options = {
        method: "POST",
        auth: "rlemon17:2414a986600078a89a1ffd937cd0debc-us6"
    }

    const request = https.request(url, options, (res2) => {
        res2.on("data", (data) => {
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();
})

app.listen(3000);

// Mailchip API: 2414a986600078a89a1ffd937cd0debc-us6
// List ID: e1048ba47e