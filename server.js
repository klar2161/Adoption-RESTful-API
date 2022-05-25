const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();

require("dotenv-flow").config();

// import product routes
const catRoutes = require("./routes/cat");
const dogRoutes = require("./routes/dog");
const authRoutes = require("./routes/auth");

app.use(express.json());
app.use(bodyParser.json());


//routes
app.get("/api/welcome", (req, res) => {
    res.status(200).send({message: "Welcome to the Awesome Adoption REST API"});
})

//import routes
app.use("/api/cats", catRoutes);
app.use("/api/dogs", dogRoutes);
app.use("/api/user", authRoutes);

const PORT = process.env.PORT || 4000;

// start up the server
app.listen(PORT, function() {
    console.log("Server is running on port: " + PORT)
})

mongoose.connect(
    process.env.DBHOST,
    {
        useUnifiedTopology: true,
        useNewUrlParser: true
    }
).catch(error => console.log('Error connecting to MongoDB' + error));
mongoose.connection.once('open', () => console.log('Connected succesfully to MongoDB'));

module.exports = app;