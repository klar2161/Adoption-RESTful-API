const chai = require("chai");
const expect = chai.expect;
const should = chai.should();
const chaiHttp = require("chai-http");
const server = require("../server");
chai.use(chaiHttp);

describe("Invalid user register test", () => {
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