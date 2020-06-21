require("./config/config");
const express = require("express");
const app = express();

//This allow serializar all request in json object
const bodyParser = require("body-parser");

/**
 * When the program has 'app.use...' these are middleware.
 * They are function that dispatch every time when I do  request
 */

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.get("/user", function(req, res) {
    res.json("Get user");
});

app.post("/user", function(req, res) {
    let body = req.body;
    if (body.name === undefined) {
        res.status(400).json({
            ok: false,
            message: "Name is required",
        });
    } else {
        res.json({ person: body });
    }
});

app.put("/user/:id", function(req, res) {
    let id = req.params.id;
    res.json({
        id,
    });
});

app.delete("/user", function(req, res) {
    res.json("delete user");
});

app.listen(process.env.PORT, () => {
    console.log("Listening server with port: ", 3000);
});