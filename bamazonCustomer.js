var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "Kolo1toure",
  database: "bamazon"
});

var productChosen="";
var quantityChosen=0;
var quantityAvailable=0;

connection.connect(function(err) {
  if (err) throw err;
  showProducts();
});

function showProducts() {
  var query = "select item_id, product_name, price from products;";
  connection.query(query, function(err, res) {
    if (err) throw err;
    console.log("ITEMS FOR SALE: " + res);
    chooseProduct();
  });
}

function chooseProduct() {
  inquirer
    .prompt({
      name: "product",
      type: "input",
      message: "Which product would you like to buy? [enter ID or type EXIT to quit]",
    })
    .then(function(answer) {
      if (answer<>"EXIT") {
        var query = "SELECT item_id, product_name, price FROM products WHERE item_id=?";
          connection.query(query, [answer], function(err, res) {
            if (err) throw err;
          console.log("Product selected: "+ res);
          productChosen=res;
            chooseQuantity();
        }
       }  return
    });
  }

function chooseQuantity() {
  inquirer
    .prompt({
      name: "quantity",
      type: "input",
      message: "How many bottles would you like to buy?"
    })
    .then(function(answer) {
    console.log("Quantity: "+ answer);
    quantityChosen=answer;
    checkQuantity();
});
}

function checkQuantity() {
  var query = "SELECT stock_quantity from products where item_id=?";
  connection.query(query, [productChosen], function(err, res) {
    if (err) throw err;
    quantityAvailable=res;
    if(quantityAvailable<quantityChosen){
      console.log("This is a popular wine and unfortunately we have sold out");
showProducts();
    }
    quantityAvailable=quantityAvailable-quantityChosen;
    shoppingCart();
  });
}

function shoppingCart() {
      var query =
        "update products set stock_quantity = ?  where item_id=?";
      connection.query(query, [quantityAvailable, productChosen], function(err, res) {
        if (err) throw err;
        console.log("Your order has been despatched!");
        showCost();
      });
    }
    function showCost (){
      var query = "select  price from products where item_id=?";
      connection.query(query,[productChosen],function(err,res){
        if(err) throw  err;
        var totalCost=quantityChosen*res;
        console.log("Total cost of wine purchase = $"+totalCost);
      })
    }
