const router = require("express").Router();
const dog = require("../models/dog");
const { verifyToken } = require("../validation");
const NodeCache = require("node-cache");
// stdTTL is the default time-to-live for each cache entry
const cache = new NodeCache({ stdTTL: 600 });

// CRUD operations

// Create dog post (post)
router.post("/", verifyToken, (req, res) => {
  data = req.body;

  dog
    .insertMany(data)
    .then((data) => {
      cache.flushAll(); //our cache has invalid data now, so we flush it to force rebuild.
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
});
// Read all dog posts (get)
router.get("/", (req, res) => {
  dog
    .find()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
});

//Query all dog posts based on if the dog is suitable for kids
router.get("/ suitableforkids/:status", (req, res) => {
  dog
    .find({ suitableForKids: req.params.status })
    .then((data) => {
      res.send(mapArray(data));
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
});

//Query all dog posts based on if the dog is suitable for an apartment
router.get("/ suitableforapartment/:status", (req, res) => {
  dog
    .find({ suitableForApartment: req.params.status })
    .then((data) => {
      res.send(mapArray(data));
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
});

//Read specific dog post based on id (get)
router.get("/:id", (req, res) => {
  dog
    .findById(req.params.id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
});

// Update specific dog post (put)
router.put("/:id", verifyToken, (req, res) => {
  const id = req.params.id;
  dog
    .findByIdAndUpdate(id, req.body, {new:true})
    .then((data) => {
      if (!data) {
        res
          .status(404)
          .send({
            message:
              "Cannot update this dog post with id=" +
              id +
              ". Maybe the post was not found!",
          });
      } else {
        res.send(data);
      }
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Error updating dog post with id=" + id });
    });
});
// Delete specific dog post (delete)
router.delete("/:id", verifyToken, (req, res) => {
  const id = req.params.id;
  dog
    .findByIdAndDelete(id)
    .then((data) => {
      if (!data) {
        res
          .status(404)
          .send({
            message:
              "Cannot delete this dog post with id=" +
              id +
              ". Maybe the dog post was not found!",
          });
      } else {
        res.send({ message: "Dog post was successfully deleted." });
      }
    })
    .catch((err) => {
      console.debug(err);
      res
        .status(500)
        .send({ message: "Error deleting dog post with id=" + id });
    });
});

module.exports = router;
