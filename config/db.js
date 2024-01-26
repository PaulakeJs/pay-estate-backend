const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI);

const connection = mongoose.connection

connection.on("connected", () => console.log("connected"));

connection.on("error", () => console.log("database error"));

module.exports = connection;
