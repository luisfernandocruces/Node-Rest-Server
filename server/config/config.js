/**
 * Process is running allways. It is a global object that it is
 * running in whole node's app
 */

// ==========================================
// Port
// ==========================================
process.env.PORT = process.env.PORT || 3000;

// ==========================================
// Enviorement
// ==========================================
process.env.NODE_ENV = process.env.NODE_ENV || "dev";

// ==========================================
// Data Base
// ==========================================
let urlDB;

if (process.env.NODE_ENV === "dev") {
    urlDB = "mongodb://localhost:27017/coffe";
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;