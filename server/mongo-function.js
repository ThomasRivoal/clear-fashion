const {MongoClient} = require('mongodb');
const MONGODB_URI = 'mongodb+srv://ThomasRiv:esilv@clearfashion.21byd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
const MONGODB_DB_NAME = 'clearfashion';

let db=null


module.exports.find = async (query) => {
    try {
      const collection = db.collection('products');
      const result = await collection.find(query).toArray();
      return result;
  
    } catch (error) {
      console.error(error);
      return null;
    }
  };
  
  module.exports.sort = async () => {
    try {
      const collection = db.collection('products');
      const result = await collection.find().sort({'price':1}).toArray();
      return result;
  
    } catch (error) {
      console.error(error);
      return null;
    }
  };