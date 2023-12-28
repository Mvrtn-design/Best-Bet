var mysql = require('mysql');

var conection = mysql.createConnection({
    host: 'localhost',
    database:'bestbet_db',
    user:'root',
    password:'Morchmiami56'
})
module.exports = conection;