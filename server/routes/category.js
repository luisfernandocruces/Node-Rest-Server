const express = require("express");

let {
    verifyToken,
    verifyAdmin_Role,
} = require("../middlewares/authentication");

let app = express();

let Category = require("../models/Category");

//-------------------------------------------
// show all categories
//-------------------------------------------
app.get("/category", verifyToken, (req, res) => {
    // Category.find({}, (err, categoryDB) => {
    //     if (err) {
    //         return res.status(400).json({
    //             ok: false,
    //             err,
    //         });
    //     }
    //     res.json({ ok: true, category: categoryDB });
    // });

    // el populate revisa que object id existe en la categoria que esto consultado y carga la infoo
    Category.find({})
        .sort("descripcion")
        .populate("usuario", "name email")
        .exec((err, categoryDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err,
                });
            }
            res.json({ ok: true, category: categoryDB });
        });
});

//-------------------------------------------
// show category by Id
//-------------------------------------------
app.get("/category/:id", verifyToken, (req, res) => {
    let id = req.params.id;

    Category.findById(id, (err, categoryDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err,
            });
        }
        if (!categoryDB) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: "id is not validated",
                },
            });
        }
        res.json({
            ok: true,
            category: categoryDB,
        });
    });
});

//-------------------------------------------
// Return the new category
//-------------------------------------------
app.post("/category", verifyToken, (req, res) => {
    let body = req.body;

    let category = new Category({
        descripcion: body.description,
        usuario: req.user._id,
    });

    category.save((err, categoryDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err,
            });
        }
        if (!categoryDB) {
            return res.status(400).json({
                ok: false,
                err,
            });
        }

        res.json({ ok: true, category: categoryDB });
    });
});

//-------------------------------------------
// update category
//-------------------------------------------
app.put("/category/:id", verifyToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;
    let descCategory = {
        descripcion: body.description,
    };
    Category.findByIdAndUpdate(
        id,
        descCategory, { new: true, runValidators: true },
        (err, categoryDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err,
                });
            }
            if (!categoryDB) {
                return res.status(400).json({
                    ok: false,
                    err,
                });
            }

            res.json({
                ok: true,
                category: categoryDB,
            });
        }
    );
});

//-------------------------------------------
// delete category, only Admin
//-------------------------------------------
app.delete("/category/:id", [verifyToken, verifyAdmin_Role], (req, res) => {
    let id = req.params.id;

    Category.findByIdAndRemove(id, (err, categoryDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err,
            });
        }
        if (!categoryDB) {
            return res.status(400).json({
                ok: false,
                message: "Id does not exist",
            });
        }
        res.json({
            ok: true,
            message: "remove category",
        });
    });
});

module.exports = app;