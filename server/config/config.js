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
// token's expiration
// ==========================================
// 60 seconds
// 60 minutes
// 24 hours
// 30 days
process.env.EXPIRATION_TOKEN = 60 * 60 * 24 * 30;

// ==========================================
// Seed of  authentication
// ==========================================
process.env.SEED = process.env.SEED || "SECRET-LUCHO";

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