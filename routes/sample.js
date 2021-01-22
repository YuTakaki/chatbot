const express = require('express');

const route = express.Router();

route.get('/', (req, res) =>{
    console.log('hi')
    res.send('hi')
});

module.exports = route