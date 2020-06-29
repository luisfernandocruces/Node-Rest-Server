const express = require("express");
const bcrypt = require("bcrypt");
const _ = require("underscore");
const app = express();
const User = require("../models/user");

app.get("/user", function(req, res) {
    // optional parameters with route /user?from=0
    let from = req.query.from || 0;
    from = Number(from);

    let limit = req.query.limit || 5;
    limit = Number(limit);

    //route= /user?limit=10&from=10

    // con el segundo argumento podemos especificar que campos queremos recortar
    // id siempre aparece
    User.find({ status: true }, "name email rol status google img")
        .skip(from)
        .limit(limit)
        .exec((err, users) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err,
                });
            }
            User.count({ status: true }, (err, count) => {
                res.json({
                    ok: true,
                    users,
                    count,
                });
            });
        });
});

app.post("/user", function(req, res) {
    let body = req.body;

    let user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        rol: body.role,
    });

    user.save((err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err,
            });
        }

        res.json({ ok: true, user: userDB });
    });
});

app.put("/user/:id", function(req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ["name", "email", "img", "status"]);

    //delete body.password;
    //delete body.goole;

    User.findByIdAndUpdate(
        id,
        body, { new: true, runValidators: true },
        (err, userDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err,
                });
            }
            res.json({
                ok: true,
                user: userDB,
            });
        }
    );
});

app.delete("/user/:id", function(req, res) {
    let id = req.params.id;
    /**
     * This is how delete physicallly of db
     */
    // User.findByIdAndRemove(id, (err, userRemoved) => {
    //     if (err) {
    //         return res.status(400).json({
    //             ok: false,
    //             err,
    //         });
    //     }
    //     if (!userRemoved) {
    //         return res.status(400).json({
    //             ok: false,
    //             error: {
    //                 message: "User did not find",
    //             },
    //         });
    //     }
    //     res.json({
    //         ok: true,
    //         user: userRemoved,
    //     });
    // });

    /**
     * The idea is not remove user, is only desactivate
     */

    let changeStatus = { status: false };

    User.findByIdAndUpdate(
        id,
        changeStatus, { new: true },
        (err, userRemoved) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err,
                });
            }
            if (!userRemoved) {
                return res.status(400).json({
                    ok: false,
                    error: {
                        message: "User did not find",
                    },
                });
            }
            res.json({
                ok: true,
                user: userRemoved,
            });
        }
    );
});

module.exports = app;