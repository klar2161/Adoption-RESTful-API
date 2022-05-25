const router = require("express").Router();
const dog = require("../models/dog");
//const NodeCache = require('node-cache');
// stdTTL is the default time-to-live for each cache entry
//const cache = new NodeCache({ stdTTL: 600 });

// CRUD operations

// Create dog post (post)
router.post("/", (req, res) => {
    data = req.body;

    dog.insertMany(data)
        .then(data => { 
            //cache.flushAll(); //our cache has invalid data now, so we flush it to force rebuild.
            res.status(201).send(data);            
        })
        .catch(err => {
            res.status(500).send({ message: err.message })
        })
});



module.exports = router;