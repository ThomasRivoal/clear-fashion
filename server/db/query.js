var MongoClient = require('mongodb').MongoClient;
const MONGODB_URI = 'mongodb+srv://ThomasRiv:esilv@clearfashion.21byd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
const MONGODB_DB_NAME = 'clearfashion';

async function Connect(){
    client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
    console.log("Connection Successful");
    db =  await client.db(MONGODB_DB_NAME);
}

module.exports.Connect = Connect;

async function Close(){
    await client.close();
    console.log("Connection Closed");
}

module.exports.Close = Close;

async function query_brand(brand_name){
    //var dbo = await db.db(MONGODB_DB_NAME);
    var oui = await db.collection("products").find({brand : brand_name}).toArray();
    console.log(oui);
}

async function query_price(max_price){
    var oui = await db.collection("products").find({price : { $lt : max_price}}).toArray();
    console.log(oui);
}

async function query_sort_price(){
    var oui = await db.collection("products").find().sort({price : -1}).toArray();
    console.log(oui);
}

module.exports.query_general= (query_)=>{
    var result = db.collection("products").find(query_).toArray();
    return result;
}

async function FindProducts_byID(id) {
    var result = await db.collection("products").find({_id : id}).toArray();
    return result;
}

module.exports.FindProducts_byID = FindProducts_byID;

async function FindProducts(limit = 0, offset = 0) {
    var result = await db.collection("products").find({}).skip(offset).limit(limit).toArray();
    return result;
}

module.exports.FindProducts = FindProducts;

async function Search(brand, price, limit){
    var query = [];
    var match = {};
    if (brand != undefined){
        match.brand = brand;
    }
    if (!isNaN(price)){
        match.price = {$lte :  price};
    }
    query.push({$match : match})
    if (!isNaN(limit)){
        query.push({$limit : limit});
    }
    console.log(query)
    var result = await db.collection("products").aggregate(query).toArray();
    return result;
}

async function EstimatedDocumentCount(){
    return await db.collection("products").estimatedDocumentCount();
}

module.exports.EstimatedDocumentCount = EstimatedDocumentCount;

module.exports.Search = Search;
