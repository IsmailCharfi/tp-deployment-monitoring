const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { Todo } = require("./model");

const app = express();

app.use(express.json());
app.use(cors());

app.get("/todos", async (req, res) => {
  try {
    const todos = (await Todo.find()).map((x) => x._doc);
    res.json(todos.map((t) => ({ ...t, id: t._id })));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/todos", async (req, res) => {
  const { title } = req.body;

  try {
    await Todo.create({ title });
    res.json({ message: "Todo added successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.patch("/todos/:id", async (req, res) => {
  const { id } = req.params;
  const { completed, title } = req.body;

  try {
    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      { completed, title },
      { new: true }
    );
    res.json({ message: "Todo updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete("/todos/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await Todo.findByIdAndDelete(id);
    res.json({ message: "Todo deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const PORT = process.env.PORT || 5050;
const DB_URL = process.env.DB_URL || "mongodb://127.0.0.1:27017/todo";

mongoose
  .connect(DB_URL)
  .then(() => app.listen(PORT))
  .then(() => console.log(`Listening on port ${PORT}`))
  .catch((error) => console.error(error));

module.exports = {
  app,
};
