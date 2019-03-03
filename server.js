const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const objectId = require("mongodb").ObjectID;
   
const app = express();
const jsonParser = express.json();
 
const mongoClient = new MongoClient("mongodb://localhost:27017/", { useNewUrlParser: true });
 
let dbClient;
 
app.use(express.static(__dirname + "/public"));
 
mongoClient.connect(function(err, client){
    if(err) return console.log(err);
    dbClient = client;
    app.locals.collection = client.db("api").collection("nums");
    app.listen(3000, function(){
        console.log("Сервер ожидает подключения...");
    });
});


app.get("/api/nums/", function(req, res){
    const name = req.query.name;   
    const collection = req.app.locals.collection;    
    collection.aggregate([
        { $match: {name}},
           {
              $project: {
                 name: 1,
                 numberOfttn: { $cond: { if: { $isArray: "$ttn" }, then: { $size: "$ttn" }, else: "NA"} }
              }
           }
        ] ), (function(err, num){
         
        if(err) return console.log(err);
        res.send(num)
    });
     
}); 

process.on("SIGINT", () => {
    dbClient.close();
    process.exit();
});
