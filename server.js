var express = require("express");
var app = express();
var mysql = require("mysql");
var bodyParser = require("body-parser");
var validator = require("aadhaar-validator");
var SHA256 = require("crypto-js/sha256");
var today = new Date();
var date =
  today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
var time =
  today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
var dateTime = date + " " + time;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

class Block {
  constructor(index, timestamp, data, previoushash = "") {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previoushash = previoushash;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    return SHA256(
      this.index +
        this.timestamp +
        this.previoushash +
        JSON.stringify(this.data)
    ).toString();
  }
}

class BlockChain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
  }
  createGenesisBlock() {
    return new Block(0, this.dateTime, "Genesis Block", "0");
  }
  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }
  addBlock(newBlock) {
    newBlock.previoushash = this.getLatestBlock().hash;
    newBlock.hash = newBlock.calculateHash();
    this.chain.push(newBlock);
  }
}

let savejeecoin = new BlockChain();

var mysqlConnection = mysql.createConnection({
  host: "35.226.81.169",
  user: "admin",
  password: "qwertyuiop",
  database: "ticketing"
});

mysqlConnection.connect(err => {
  if (!err) console.log("Connection succeeded.");
  else
    console.log("Unsuccessful \n Error : " + JSON.stringify(err, undefined, 2));
});

app.post("/entry", function(req, res) {
  var aadhar = req.body.aadharno;
  var re = 'uid="(.*?)"';
  var found = aadhar.match(re);
  var check = validator.isValidNumber(found[1]);
  // var check = validator.isValidNumber(aadhar);
  if (check) {
    console.log("Valid Number " + found[1]);

    savejeecoin.addBlock(new Block(found[1], dateTime, { amount: 10 }));
  } else {
    // console.log("Invalid AADHAR no. " + found[1]);
    console.log("Invalid AADHAR no. " + aadhar);
  }
  res.write("Submitted Succesfully");
});
app.listen(8001);
