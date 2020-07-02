const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");

app.get("/image/:type/:img", (req, res) => {
    let type = req.params.type;
    let img = req.params.img;

    let pathImage = path.resolve(__dirname, `../../uploads/${type}/${img}`);

    if (fs.existsSync(pathImage)) {
        res.sendFile(pathImage);
    } else {
        let noImagePath = path.resolve(__dirname, "../assets/no-image.jpg");

        // para que esta función funcione, se requiere especificar
        // el path absoluto de la imagen
        res.sendFile(noImagePath);
    }
});

module.exports = app;