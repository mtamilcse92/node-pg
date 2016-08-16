var http = require('http');
var express = require('express');
var pg = require('pg');
var app = express();
var conString = "pg://postgres:55555@localhost:5432/database";
var client = new pg.Client(conString);
client.connect();

app.post('/', function(req, res) {
    var query = client.query("CREATE TABLE IF NOT EXISTS emps(id int PRIMARY KEY NOT NULL, empName varchar(64), empGender varchar(64), empAge int, empSalary int)");
    query.on('error', function(err) {
        console.log(err)
    });
    res.send("table created");
});

app.post('/insert', function(req, res) {
    var id = req.param('id');
    var empName = req.param('empName');
    var empGender = req.param('empGender');
    var empAge = req.param('empAge');
    var empSalary = req.param('empSalary');
    var query = client.query("INSERT INTO emps(id, empName, empGender, empAge, empSalary) values($1, $2, $3, $4, $5)", [id, empName, empGender, empAge, empSalary]);
    query.on('error', function(err) {
        console.log(err)
    });
    res.send("values inserted");
});

app.get('/find/:id', function(req, res) {
    var id = req.param('id');
    var query = client.query("SELECT * FROM  emps WHERE id = $1", [id]);
    query.on('error', function(err) {
        console.log(err)
    });
    query.on("row", function(row, result) {
        result.addRow(row);
        console.log(row);
    });
    query.on("end", function(result) {
        console.log(JSON.stringify(result.rows, null, "    "));
        res.send(JSON.stringify(result.rows, null, "    "));
    });
});

app.delete('/table', function(req, res) {
    var query = client.query("DROP TABLE emps");
    query.on('error', function(err) {
        console.log(err)
    });
    res.send("table deleted");
});

app.listen(3031);
console.log("server is running....");
