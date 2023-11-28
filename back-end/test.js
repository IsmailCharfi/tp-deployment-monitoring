const chai = require("chai");
const chaiHttp = require("chai-http");
const { app } = require("./index");
const { Todo } = require("./model");
const mongoose = require("mongoose");

const { expect } = chai;
chai.use(chaiHttp);

describe("TODO API", () => {
  describe("GET /todos", () => {
    it("should get all todos", async () => {
      await Todo.deleteMany({});

      await Todo.create({ title: "First Task" });

      const res = await chai.request(app).get("/todos");

      expect(res).to.have.status(200);
      expect(res.body).to.be.an("array");
      expect(res.body).to.have.lengthOf(1);
      expect(res.body[0].title).to.equal("First Task");
    });
  });

  describe("POST /todos", () => {
    it("should create a new todo", async () => {
      await Todo.deleteMany({});

      const todoData = { title: "New Task" };

      let res = await chai.request(app).post("/todos").send(todoData);

      expect(res).to.have.status(200);

      res = await chai.request(app).get("/todos");

      expect(res).to.have.status(200);
      expect(res.body).to.be.an("array");
      expect(res.body).to.have.lengthOf(1);
      expect(res.body[0].title).to.equal("New Task");
    });
  });

  describe("Mock Test", () => {
    it("should pass if FAILURE variable is not true", async () => {
      expect(process.env.FAILURE).to.not.equal("true");
    });
  });

  after(async () => {
    await mongoose.connection.close();
  });
});
