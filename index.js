var http = require('http');
var express = require('express');
var pg = require('pg');
var app = express();
var conString = "pg://postgres:55555@localhost:5432/database";
var client = new pg.Client(conString);
client.connect();

app.post('/', function(req, res){
client.query("CREATE TABLE IF NOT EXISTS emps(firstname varchar(64), lastname varchar(64))");
res.send("table created");
});

app.post('/insert', function(req, res){
client.query("INSERT INTO emps(firstname, lastname) values($1, $2)", ['aaa', 'bbb']);
res.send("values inserted");
});

app.get('/find', function(req, res){
var query = client.query("SELECT * FROM  emps");
query.on("row", function (row, result) {
    result.addRow(row);
    console.log(row);
});
query.on("end", function (result) {
    console.log(JSON.stringify(result.rows, null, "    "));
    res.send(JSON.stringify(result.rows, null, "    "));
    client.end();
});
});

app.delete('/table', function(req, res){
client.query("DROP TABLE emps");
res.send("table deleted")
client.end();
});

app.listen(3031);
console.log("server is running....");