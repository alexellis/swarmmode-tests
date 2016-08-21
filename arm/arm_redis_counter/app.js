"use strict"

const redis = require('redis');
const express = require('express')
let app = express();

let redisClient = redis.createClient({host: "redis"});

app.get("/incr", (req, res) => {
  redisClient.incr("counter", (err, val) => {
    res.status(200).send({"count": val});
  });
  
});

app.listen(3000, () =>
{
  console.log("Listening");
});
