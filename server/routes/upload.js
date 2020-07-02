const express = require("express");
const fileUpload = require("express-fileupload");
const app = express();

const User = require("../models/user");
const Product = require("../models/producto");

const fs = require("fs");
const path = require("path");

//transforma todo lo que se esta subiendo en un objeto file

// default options
app.use(fileUpload());

app.put("/upload/:type/:id", function(req, res) {
    let type = req.params.type;
    let id = req.params.id;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: "Do not select any file",
            },
        });
    }

    // Validate type
    let correctTypes = ["products", "users"];

    if (correctTypes.indexOf(type) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: "The correct types are " + correctTypes.join(", "),
                type,
            },
        });
    }

    let file = req.files.file;
    let nameFileSplit = file.name.split(".");
    let extension = nameFileSplit[nameFileSplit.length - 1];

    // Allow extensions
    let validateExtensions = ["png", "jpg", "gif", "jpeg"];

    if (validateExtensions.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: "The allowed extensions are " + validateExtensions.join(", "),
                ext: extension,
            },
        });
    }

    // CHange name of the file
    let nameFile = `${id}-${new Date().getMilliseconds()}.${extension}`;

    file.mv(`uploads/${type}/${nameFile}`, (err) => {
        if (err)
            return res.status(500).json({
                ok: false,
                err,
            });
        // Here, the image is upload
        if (type === "users") {
            imageUser(id, res, nameFile);
        } else {
            imageProduct(id, res, nameFile);
        }
    });
});

function imageUser(id, res, nameFile) {
    User.findById(id, (err, userDB) => {
        if (err) {
            deleteFile(nameFile, "users");
            return res.status(500).json({
                ok: false,
                err,
            });
        }

        if (!userDB) {
            deleteFile(nameFile, "users");
            return res.status(400).json({
                ok: false,
                err: {
                    message: "user does not exist",
                },
            });
        }
        deleteFile(userDB.img, "users");
        userDB.img = nameFile;
        userDB.save((err, userSaved) => {
            res.json({
                ok: true,
                user: userSaved,
                img: nameFile,
            });
        });
    });
}

function imageProduct(id, res, nameFile) {
    Product.findById(id, (err, productDB) => {
        if (err) {
            deleteFile(nameFile, "products");
            return res.status(500).json({
                ok: false,
                err,
            });
        }

        if (!productDB) {
            deleteFile(nameFile, "products");
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Product does not exist",
                },
            });
        }
        deleteFile(productDB.img, "products");
        productDB.img = nameFile;
        productDB.save((err, productSaved) => {
            res.json({
                ok: true,
                products: productSaved,
                img: nameFile,
            });
        });
    });
}

function deleteFile(nameImage, type) {
    let pathImage = path.resolve(__dirname, `../../uploads/${type}/${nameImage}`);

    if (fs.existsSync(pathImage)) {
        console.log(__dirname);
        console.log(pathImage);
        fs.unlinkSync(pathImage);
    }
}

module.exports = app;