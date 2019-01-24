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
  selectItem();
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

function selectItem() {
  //   connection.query("SELECT * FROM products", function(err, results) {
  //     if (err) throw err;
  inquirer
    .prompt([
      {
        name: "choice",
        type: "rawlist",
        choices: function() {
          var choiceArray = [];
          for (var i = 0; i < results.length; i++) {
            choiceArray.push(results[i].item_id);
          }
          return choiceArray;
        },
        message: "What is the ID of the item you would like to purschase?"
      },
      {
        name: "select",
        type: "input",
        mesage: "How many would you like to buy?"
      }
    ])
    .then(function(answer) {
      var chosenId;
      for (var i = 0; i < results.length; i++) {
        if (results[i].item_id === answer.choice) {
          chosenId = results[i];
        }
      }
    });
}
