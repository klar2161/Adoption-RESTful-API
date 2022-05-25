const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let dogSchema = new Schema(
    {
        name: {type: String},
        breed: {type: String},
        age: {type: String},
        gender: {type: String},
        suitableForKids: {type: Boolean},
        suitableInApartment: {type:Boolean}
    }
);

module.exports = mongoose.model("dog", dogSchema);