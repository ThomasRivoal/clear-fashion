const cors = require('cors');
const express = require('express');
const helmet = require('helmet');

const {MongoClient} = require('mongodb');
const MONGODB_URI = 'mongodb+srv://ThomasRiv:esilv@clearfashion.21byd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
const MONGODB_DB_NAME = 'clearfashion';

const PORT = 8092;

const app = express();

module.exports = app;

app.use(require('body-parser').json());
app.use(cors());
app.use(helmet());

app.options('*', cors());

app.get('/', (request, response) => {
  response.send({'ack': true});
});

async function Connect(){
  client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
  console.log("Connection Successful");
  db =  await client.db(MONGODB_DB_NAME);
}

app.get('/products', async(request, response) => {
  await Connect();
  const prod= await mongo.find();
  response.send(prod);
});

app.get('/:id', async(request, response) => {
  await Connect();
  const idprod= await mongo.find({'_id':request.params.id});
  response.send(idprod);
});


app.get('/products/:search', async(request, response) => {
  await Connect();
  const query= request.query
  const toFind={}

  if(request.query.price!=null)
  {
    toFind['price'] = parseFloat(request.query.price);
  }
  if(request.query.brand!= null)
  {
    toFind['brand'] = request.query.brand;
  }
    
  searchprod= await mongo.find(toFind);

  let limit=request.query.slice;
  if(request.query.slice==null)
  { limit=12}
  searchprod=searchprod.slice(0,limit);
  
  response.send(searchprod);
});

app.listen(PORT);

console.log(`📡 Running on port ${PORT}`);


