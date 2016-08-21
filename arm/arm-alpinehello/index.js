"use strict"

const express = require('express');
let app = express();

app.get("/", (req, res) =>
{
   res.status(200).send("Hello");
});

app.listen(3000, () => {
   console.log("I'm listening.")
});

