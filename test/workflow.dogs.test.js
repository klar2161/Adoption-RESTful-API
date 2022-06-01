const chai = require("chai");
const expect = chai.expect;
const should = chai.should();
const chaiHttp = require("chai-http");
const server = require("../server");
const dog = require("../models/dog")
chai.use(chaiHttp);

describe("Dog user workflow tests + CRUD tests", () => {
   
  it('List all dog posts', (done) =>{
    chai.request(server)
    .get('/api/dogs')
    .end((err, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body).to.be.a("array");
        done();
    })
    });


  it("Test verify one post in DB - should register + login a user, create dog post and verify 1 in DB", (done) => {
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

            // 3) Create new dog post
            let dog = {
              name: "Test Dog",
              breed: "Test Dog breed",
              age: "Test Dog age",
              gender: "Test Dog gender",
              suitableForKids: false,
              suitableInApartment: true,
            };

            chai
              .request(server)
              .post("/api/dogs")
              .set({ "auth-token": token })
              .send(dog)
              .end((err, res) => {
                // Asserts
                expect(res.status).to.be.equal(200);
                expect(res.body).to.be.a("array");
                expect(res.body.length).to.be.eql(1);

                let savedDog = res.body[0];
                expect(savedDog.name).to.be.equal(dog.name);
                expect(savedDog.breed).to.be.equal(dog.breed);
                expect(savedDog.age).to.be.equal(dog.age);
                expect(savedDog.suitableForKids).to.be.equal(
                  dog.suitableForKids
                );
                expect(savedDog.suitableInApartment).to.be.equal(
                  dog.suitableInApartment
                );

                // 4) Verify one dog post in test DB
                chai
                  .request(server)
                  .get("/api/dogs")
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
    it("Dog route - should register + login a user, create dog post, update dog post and delete it from DB", (done) => {
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
  
              // 3) Create new dog post
              let dog = {
                name: "Test Dog",
                breed: "Test Dog breed",
                age: "Test Dog age",
                gender: "Test Dog gender",
                suitableForKids: false,
                suitableInApartment: true,
              };
  
              chai
                .request(server)
                .post("/api/dogs")
                .set({ "auth-token": token })
                .send(dog)
                .end((err, res) => {
                  // Asserts
                  expect(res.status).to.be.equal(200);
                  expect(res.body).to.be.a("array");
                  expect(res.body.length).to.be.eql(1);
  
                  
                  let savedDog = res.body[0];
                  expect(savedDog.name).to.be.equal(dog.name);
                  expect(savedDog.breed).to.be.equal(dog.breed);
                  expect(savedDog.age).to.be.equal(dog.age);
                  expect(savedDog.suitableForKids).to.be.equal(
                    dog.suitableForKids
                  );
                  expect(savedDog.suitableInApartment).to.be.equal(
                    dog.suitableInApartment
                  );
  
                  // 4) Update the dog post
  
                  chai
                    .request(server)
                    .put("/api/dogs/" + savedDog._id)
                    .set({ "auth-token": token })
                    .send({
                      _id: savedDog._id,
                      name: "Test Dog - update"
                    })
                    .end((err, res) => {
                      expect(res.status).to.be.equal(200);
                      expect(res.body).to.be.a("object");
                      let updatedDog = res.body;
                     
                      expect(updatedDog.name).to.be.equal("Test Dog - update");
                     
                    });
  
                  // 4) Delete dog post
                  chai
                    .request(server)
                    .delete("/api/dogs/" + savedDog._id)
                    .set({ "auth-token": token })
                    .end((err, res) => {
                      // Asserts
                      expect(res.status).to.be.equal(200);
                      const actualVal = res.body.message;
                      expect(actualVal).to.be.equal(
                        "Dog post was successfully deleted."
                      );
                      done();
                    });
                });
            });
        });
    });


});
