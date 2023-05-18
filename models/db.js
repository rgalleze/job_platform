var mysql = require("mysql");
require("dotenv").config();

// Les données MYSQL_DATABASE, MYSQL_USER, MYSQL_PASSWORD, MYSQL_HOST se trouvent dans le fichier .env
var pool = mysql.createPool({
host: process.env.MYSQL_HOST, 
user: process.env.MYSQL_USER,
password: process.env.MYSQL_PASSWORD,
database: process.env.MYSQL_DATABASE
});
module.exports = pool;