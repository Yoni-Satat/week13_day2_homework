const express = require('express');
const parser = require('body-parser');
const server = express();
const MongoClient = require('mongodb').MongoClient;

server.use(parser.json());
server.use(express.static('client/build'));
server.use(parser.urlencoded({extended: true}));

MongoClient.connect('mongodb://localhost:27017', function(err, client) {
  if(err) {
    console.log(err);
    return;
  }

  const db = client.db("my_pets");
  console.log("Connected to database");

  server.post('/api/pets', function(req, res) {
    db.collection('pets').insert(req.body.pet, function(err, result) {
      if(err) {
        console.log(err);
        res.status(500);
        res.send();
        return;
      }
      console.log('Saved to database');
      res.status(201);
      res.json(result.ops[0]);
    });
  });

  server.get('/api/pets', function(req, res) {
    db.collection('pets').find().toArray(function(err, result) {
      if(err) {
        console.log(err);
        res.status(500);
        res.send();
      }
      res.json(result);
    });
  });

  server.delete('/api/pets', function(req, res) {
    db.collection('pets').remove({}, function(err, result) {
      if(err) {
        console.log(err);
        res.status(500);
        res.send();
        return;
      }
      res.status(204);
      res.send();
    });
  });



  server.listen(3000, function(){
    console.log("Listening on port 3000");
  });
//end
});
