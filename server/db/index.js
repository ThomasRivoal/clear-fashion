require('dotenv').config();
const {MongoClient} = require('mongodb');
const fs = require('fs');

const MONGODB_DB_NAME = 'clearfashion';
const MONGODB_COLLECTION = 'products';
const MONGODB_URI = 'mongodb+srv://ThomasRiv:esilv@clearfashion.21byd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

let client = null;
let database = null;
console.log("geee")
/**
 * Get db connection
 * @type {MongoClient}
 */
const getDB = module.exports.getDB = async () => {
  try {
    if (database) {
      console.log('💽  Already Connected');
      return database;
    }

    client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
    database = client.db(MONGODB_DB_NAME);

    console.log('💽  Connected');

    return database;
  } catch (error) {
    console.error('🚨 MongoClient.connect...', error);
    return null;
  }
};

/**
 * Insert list of products
 * @param  {Array}  products
 * @return {Object}
 */
module.exports.insert = async products => {
  try {
    const db = await getDB();
    const collection = db.collection(MONGODB_COLLECTION);
    // More details
    // https://docs.mongodb.com/manual/reference/method/db.collection.insertMany/#insert-several-document-specifying-an-id-field
    const result = await collection.insertMany(products, {'ordered': false});

    return result;
  } catch (error) {
    console.error('🚨 collection.insertMany...', error);
    fs.writeFileSync('products.json', JSON.stringify(products));
    return {
      'insertedCount': error.result.nInserted
    };
  }
};

/**
 * Find products based on query
 * @param  {Array}  query
 * @return {Array}
 */
module.exports.find = async (offset,query,limit) => {
  try {
    const db = await getDB();
    const collection = db.collection(MONGODB_COLLECTION);
    const result = await collection.find(query)
    .skip(offset)
    .limit(limit)
    .toArray()


    return result;
  } catch (error) {
    console.error('🚨 collection.find...', error);
    return null;
  }
};

module.exports.docu = async () =>{
  const db = await getDB();
  const collection = db.collection(MONGODB_COLLECTION);
  return await collection.estimatedDocumentCount();
}


/**
 * Close the connection
 */
module.exports.close = async () => {
  try {
    await client.close();
  } catch (error) {
    console.error('🚨 MongoClient.close...', error);
  }
};

// const brand = 'loom';
    // const collection = db.collection('products');
    // const products = await collection.find({brand}).toArray();
    // console.log('all brand products');
    // console.log(products);