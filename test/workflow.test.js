const chai = require("chai");
const expect = chai.expect;
const should = chai.should();
const chaiHttp = require("chai-http");
const server = require("../server");
const cat = require("../models/cat")
chai.use(chaiHttp);

describe("/First Test Collection", () => {
  it("test default API welcome route", (done) => {
    //actual test content in here

    chai
      .request(server)
      .get("/api/welcome")
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");

        const actualVal = res.body.message;
        expect(actualVal).to.be.equal(
          "Welcome to the Awesome Adoption REST API"
        );

        console.log(res.body.message);
        done();
      });
  });
});

describe('GET all cat posts', () => {
    it('List all cat posts', (done) =>{
    chai.request(server)
    .get('/api/cats')
    .end((err, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body).to.be.a("array");
        expect(res.body.error).to.be.equal(null);
        done();
    })
    });
    });
    

describe("User workflow tests", () => {
  it("should register + login a user, create cat post and verify 1 in DB", (done) => {
    // 1) Register new user
    let user = {
      name: "Tereza Sulc",
      email: "sulctereza@gmail.com",
      password: "123456",
    };
    chai
      .request(server)
      .post("/api/user/register")
      .send(user)
      .end((err, res) => {
        // Asserts
        expect(res.status).to.be.equal(200);
        expect(res.body).to.be.a("object");
        expect(res.body.error).to.be.equal(null);

        // 2) Login the user
        chai
          .request(server)
          .post("/api/user/login")
          .send({
            email: "sulctereza@gmail.com",
            password: "123456",
          })
          .end((err, res) => {
            // Asserts
            expect(res.status).to.be.equal(200);
            expect(res.body.error).to.be.equal(null);
            let token = res.body.data.token;

            // 3) Create new cat post
            let cat = {
              name: "Test Cat",
              breed: "Test Cat breed",
              age: "Test Cat age",
              gender: "Test Cat gender",
              suitableForKids: false,
              suitableInApartment: true,
            };

            chai
              .request(server)
              .post("/api/cats")
              .set({ "auth-token": token })
              .send(cat)
              .end((err, res) => {
                // Asserts
                expect(res.status).to.be.equal(200);
                expect(res.body).to.be.a("array");
                expect(res.body.length).to.be.eql(1);

                let savedCat = res.body[0];
                expect(savedCat.name).to.be.equal(cat.name);
                expect(savedCat.breed).to.be.equal(cat.breed);
                expect(savedCat.age).to.be.equal(cat.age);
                expect(savedCat.suitableForKids).to.be.equal(
                  cat.suitableForKids
                );
                expect(savedCat.suitableInApartment).to.be.equal(
                  cat.suitableInApartment
                );

                // 4) Verify one cat post in test DB
                chai
                  .request(server)
                  .get("/api/cats")
                  .end((err, res) => {
                    // Asserts
                    expect(res.status).to.be.equal(200);
                    expect(res.body).to.be.a("array");
                    expect(res.body.length).to.be.eql(1);

                    done();
                  });
              });
          });
      });
  });

  // Valid input test (register, login, )
  it("should register + login a user, create cat post, update cat post and delete it from DB", (done) => {
    // 1) Register new user
    let user = {
      name: "Tereza Sulc",
      email: "sulctereza@gmail.com",
      password: "123456",
    };
    chai
      .request(server)
      .post("/api/user/register")
      .send(user)
      .end((err, res) => {
        // Asserts
        expect(res.status).to.be.equal(200);
        expect(res.body).to.be.a("object");
        expect(res.body.error).to.be.equal(null);

        // 2) Login the user
        chai
          .request(server)
          .post("/api/user/login")
          .send({
            email: "sulctereza@gmail.com",
            password: "123456",
          })
          .end((err, res) => {
            // Asserts
            expect(res.status).to.be.equal(200);
            expect(res.body.error).to.be.equal(null);
            let token = res.body.data.token;

            // 3) Create new cat post
            let cat = {
              name: "Test Cat",
              breed: "Test Cat breed",
              age: "Test Cat age",
              gender: "Test Cat gender",
              suitableForKids: false,
              suitableInApartment: true,
            };

            chai
              .request(server)
              .post("/api/cats")
              .set({ "auth-token": token })
              .send(cat)
              .end((err, res) => {
                // Asserts
                expect(res.status).to.be.equal(200);
                expect(res.body).to.be.a("array");
                expect(res.body.length).to.be.eql(1);

                let savedCat = res.body[0];
                expect(savedCat.name).to.be.equal(cat.name);
                expect(savedCat.breed).to.be.equal(cat.breed);
                expect(savedCat.age).to.be.equal(cat.age);
                expect(savedCat.suitableForKids).to.be.equal(
                  cat.suitableForKids
                );
                expect(savedCat.suitableInApartment).to.be.equal(
                  cat.suitableInApartment
                );

                // 4) Update the cat post

                chai
                  .request(server)
                  .put("/api/cats" + savedCat._id)
                  .set({ "auth-token": token })
                  .send({
                    _id: savedCat._id,
                    name: "Test Cat - update"
                  })
                  .end((err, res) => {
                    
                    expect(res.status).to.be.equal(200);
                    expect(res.body).to.be.a("array");
                    expect(res.body.length).to.be.eql(1);

                    let savedCat = res.body[0];
                    expect(savedCat.name).to.be.equal(cat.name);
                   
                  });

                // 4) Delete cat post
                chai
                  .request(server)
                  .delete("/api/cats/" + savedCat._id)
                  .set({ "auth-token": token })
                  .end((err, res) => {
                    // Asserts
                    expect(res.status).to.be.equal(200);
                    const actualVal = res.body.message;
                    expect(actualVal).to.be.equal(
                      "Cat post was successfully deleted."
                    );
                    done();
                  });
              });
          });
      });
  });

  // Invalid input test
  it("should register user with invalid input", (done) => {
    // 1) Register new user with invalid inputs
    let user = {
      name: "Tereza Sulc",
      email: "sulctereza@gmail.com",
      password: "123", //Faulty password - Joi/validation should catch this...
    };
    chai
      .request(server)
      .post("/api/user/register")
      .send(user)
      .end((err, res) => {
        // Asserts
        expect(res.status).to.be.equal(400); //normal expect with no custom output message
        //expect(res.status,"Status is not 400 (NOT FOUND)").to.be.equal(400); //custom output message at fail

        expect(res.body).to.be.a("object");
        expect(res.body.error.message).to.be.equal(
          '"password" length must be at least 6 characters long'
        );
        done();
      });
  });
});
