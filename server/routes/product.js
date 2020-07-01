const express = require("express");
const { verifyToken } = require("../middlewares/authentication");

let app = express();
let Product = require("../models/producto");

// ========================================
//  Get all products
// ========================================
app.get("/products", verifyToken, (req, res) => {
    let from = req.query.from || 0;
    from = Number(from);
    Product.find({ disponible: true })
        .skip(from)
        .limit(5)
        .populate("usuario", "name email ")
        .populate("categoria", "descripcion")
        .exec((err, productsDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err,
                });
            }
            res.json({ ok: true, products: productsDB });
        });
});

// ========================================
//  Get product by id
// ========================================
app.get("/products/:id", verifyToken, (req, res) => {
    let id = req.params.id;
    Product.findById(id)
        .populate("usuario", "name email ")
        .populate("categoria", "descripcion")
        .exec((err, productDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err,
                });
            }
            if (!productDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "ID does nt exist",
                    },
                });
            }
            res.json({
                ok: true,
                product: productDB,
            });
        });
});

// ========================================
//  Looking for products
// ========================================
app.get("/products/search/:termino", verifyToken, (req, res) => {
    let termino = req.params.termino;
    // la i es de que ignore mayusculas y minusculas
    let regex = new RegExp(termino, "i");
    Product.find({ nombre: regex })
        .populate("categoria", "descripcion")
        .exec((err, products) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err,
                });
            }
            res.json({
                ok: true,
                products,
            });
        });
});

// ========================================
//  Get all products
// ========================================
app.post("/products", verifyToken, (req, res) => {
    let body = req.body;
    let product = new Product({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        usuario: req.user._id,
        categoria: body.categoria,
        disponible: body.disponible,
    });

    product.save((err, productDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err,
            });
        }

        res.status(201).json({ ok: true, products: productDB });
    });
});

// ========================================
//  Update product by id
// ========================================
app.put("/products/:id", verifyToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    Product.findById(id, { new: true, runValidators: true }, (err, productDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err,
            });
        }
        if (!productDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "id product does not find",
                },
            });
        }

        productDB.nombre = body.nombre;
        productDB.precioUni = body.precioUni;
        productDB.categoria = body.categoria;
        productDB.disponible = body.disponible;
        productDB.descripcion = body.descripcion;

        productDB.save((err, saveProduct) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err,
                });
            }
            res.json({ ok: true, products: saveProduct });
        });
    });
});

// ========================================
//  Delete a product
// ========================================
app.delete("/products/:id", verifyToken, (req, res) => {
    let id = req.params.id;

    Product.findById(id, (err, productDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err,
            });
        }
        if (!productDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "id product does not find",
                },
            });
        }
        productDB.disponible = false;
        productDB.save((err, saveProduct) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err,
                });
            }
            res.json({ ok: true, products: saveProduct });
        });
    });
});

module.exports = app;