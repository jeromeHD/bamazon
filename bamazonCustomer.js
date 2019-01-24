var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port;
  port: 8889,

  // Your username
  user: "root",

  // Your password
  password: "root",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  readProducts();
});

function readProducts() {
  connection.query("SELECT * FROM products", function(err, rows) {
    if (err) throw err;
    rows.forEach(function(result) {
      console.log(
        "item_id: " +
          result.item_id +
          " || product_name: " +
          result.product_name +
          " || price: " +
          result.price +
          " || stock_quantity: " +
          result.stock_quantity
      );
    });
  });
}
