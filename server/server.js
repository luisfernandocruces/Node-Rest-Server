require("./config/config");
const express = require("express");
const app = express();
const colors = require("colors");

const mongoose = require("mongoose");

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

// global config of routes
app.use(require("./routes/index"));

/**
 * If db does not exists... mongo can connect and then, when you use that db,
 * It will create the structure in db
 */
mongoose.connect(
    process.env.URLDB, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
    (err, res) => {
        if (err) {
            throw err;
        }

        console.log("data base online".green);
    }
);

app.listen(process.env.PORT, () => {
    console.log("Listening server with port: ", 3000);
});