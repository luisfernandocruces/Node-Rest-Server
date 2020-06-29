const jwt = require("jsonwebtoken");

// ==========================================
// verify token
// ==========================================
let verifyToken = (req, res, next) => {
    // get heder
    let token = req.get("token");
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err,
            });
        }
        req.user = decoded.user;
        next();
    });
};

// ==========================================
// verify ADMINROLE
// ==========================================
let verifyAdmin_Role = (req, res, next) => {
    let user = req.user;
    if (user.rol === "ADMIN_ROLE") {
        next();
    } else {
        return res.json({
            ok: false,
            err: {
                message: "USER IS NOT ADMIN",
            },
        });
    }
};

module.exports = { verifyToken, verifyAdmin_Role };