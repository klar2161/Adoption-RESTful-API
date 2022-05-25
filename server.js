const express = require("express");
const mongoose = require("mongoose");
//const bodyParser = require("body-parser");
const app = express();

//load configuration from .env file
require("dotenv-flow").config();

//swagger dependencies
const swaggerUi = require("swagger-ui-express");
const yaml = require("yamljs");

//setup swagger
const swaggerDefinition = yaml.load('./swagger.yaml');
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDefinition));

// import routes and authentication
const catRoutes = require("./routes/cat");
const dogRoutes = require("./routes/dog");
const authRoutes = require("./routes/auth");

app.use(express.json());
//app.use(bodyParser.json());


//routes
app.get("/api/welcome", (req, res) => {
    res.status(200).send({message: "Welcome to the Awesome Adoption REST API"});
})


app.use("/api/cats", catRoutes); //CRUD routes
app.use("/api/dogs", dogRoutes); //CRUD routes
app.use("/api/user", authRoutes); //auth routes to secure the API endpoints

const PORT = process.env.PORT || 4000;

// start up the server
app.listen(PORT, function() {
    console.log("Server is running on port: " + PORT)
})

//connect to the MongoDB using Mongoose ODM
mongoose.connect(
    process.env.DBHOST,
    {
        useUnifiedTopology: true,
        useNewUrlParser: true
    }
).catch(error => console.log('Error connecting to MongoDB' + error));
mongoose.connection.once('open', () => console.log('Connected succesfully to MongoDB'));

module.exports = app;