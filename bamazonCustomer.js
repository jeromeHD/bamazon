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
    placeOrder();
  });
}
function placeOrder() {
  inquirer
    .prompt([
      {
        name: "item_Id",
        message: "Please enter the ID of the item you wish to purchase.",
        validate: function(value) {
          var valid = value.match(/^[0-9]+$/);
          if (valid) {
            return true;
          }
          return "Please enter a valid Item ID";
        }
      },
      {
        name: "stock_quantity",
        message: "How many of this item would you like to order?",
        validate: function(value) {
          var valid = value.match(/^[0-9]+$/);
          if (valid) {
            return true;
          }
          return "Please enter a numerical value";
        }
      }
    ])
    .then(
      function(answer) {
        console.log("ans", answer);

        connection.query("SELECT * FROM products WHERE item_id = ?", [answer.item_Id], function(err, res) {
          if (answer.selectQuantity > res[0].stock_quantity) {
            console.log("Insufficient Quantity, your order has been cancelled!");
            newOrder();
          } else {
            amountOwed = res[0].price * answer.stock_quantity;
            console.log("Thanks for your order");
            console.log("You owe $" + amountOwed);
            console.log("");
            //update products table
            connection.query(
              "UPDATE products SET ? Where ?",
              [
                {
                  stock_quantity: res[0].stock_quantity - answer.selectQuantity
                },
                {
                  id: answer.item_id
                }
              ],
              function(err, res) {}
            );
            newOrder();
          }
        });
      },
      function(err, res) {}
    );
}
function newOrder() {
  inquirer
    .prompt([
      {
        type: "confirm",
        name: "choice",
        message: "Would you like to place another order?"
      }
    ])
    .then(function(answer) {
      if (answer.choice) {
        placeOrder();
      } else {
        console.log("Thank you for shopping at Bamazon!");
        connection.end();
      }
    });
}
readProducts();
