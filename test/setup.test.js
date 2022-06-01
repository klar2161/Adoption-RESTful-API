process.env.NODE_ENV = 'test';

const Cat = require('../models/cat');
const Dog = require('../models/dog');
const User = require('../models/user');


//clean up the database before and after each test
beforeEach((done) => { 
    Cat.deleteMany({}, function(err) {});
    Dog.deleteMany({}, function(err) {});
    User.deleteMany({}, function(err) {});
    done();
});

afterEach((done) => {
    User.deleteMany({}, function(err) {});
    Cat.deleteMany({}, function(err) {});
    done();
});