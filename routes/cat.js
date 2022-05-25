const router = require("express").Router();
const cat = require("../models/cat");
const { verifyToken } = require("../validation");
const NodeCache = require('node-cache');
// stdTTL is the default time-to-live for each cache entry
const cache = new NodeCache({ stdTTL: 600 });

// CRUD operations

// Create cat post (post)
router.post("/", verifyToken, (req, res) => {
  data = req.body;

  cat.insertMany(data)
    .then((data) => {
      cache.flushAll(); //our cache has invalid data now, so we flush it to force rebuild.
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
});
// Read all cat posts (get)
router.get("/", (req, res) => {
  cat.find()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
});

//Query all cat posts based on if the cat is suitable for kids
router.get("/ suitableforkids/:status", (req, res) => {
  cat.find({ suitableForKids: req.params.status })
    .then((data) => {
      res.send(mapArray(data));
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
});

//Query all cat posts based on if the cat is suitable for an apartment
router.get("/ suitableinapartment/:status", (req, res) => {
  cat.find({ suitableInApartment: req.params.status })
    .then((data) => {
      res.send(mapArray(data));
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
});

//Read specific cat post based on id (get)
router.get("/:id", (req, res) => {
  cat.findById(req.params.id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
});

// Update specific cat post (put)
router.put("/:id", verifyToken, (req, res) => {
  const id = req.params.id;
  cat.findByIdAndUpdate(id, req.body)
    .then((data) => {
      if (!data) {
        res
          .status(404)
          .send({
            message:
              "Cannot update this cat post with id=" +
              id +
              ". Maybe the post was not found!",
          });
      } else {
        res.send({ message: "Cat post was successfully updated." });
      }
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Error updating cat post with id=" + id });
    });
});
// Delete specific cat post (delete)
router.delete("/:id", verifyToken, (req, res) => {

    const id = req.params.id;
    cat.findByIdAndDelete(id)
        .then(data => {
            if (!data) {
                res.status(404).send({ message: "Cannot delete this cat post with id=" + id + ". Maybe the cat post was not found!" });
            }
            else {
                res.send({ message: "Cat post was successfully deleted." });
            }
        })
        .catch(err => {
            console.debug(err);
            res.status(500).send({ message: "Error deleting cat post with id=" + id })
        })
});

module.exports = router;
