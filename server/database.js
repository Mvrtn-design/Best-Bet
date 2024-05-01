var mysql = require('mysql');

var conection = mysql.createConnection({
    host: 'localhost',
    database:'bestbetdb',
    user:'root',
    password:'Morchmiami56'
})
module.exports = conection;