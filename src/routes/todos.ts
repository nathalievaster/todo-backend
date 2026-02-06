import { Router } from "express";
import type { Todo } from "../models/todo.js";
import { randomUUID } from "crypto";

const router = Router();

// Tillfällig "databas" i minnet
let todos: Todo[] = [];

/**
 * GET - Hämta alla todos
 */
router.get("/", (req, res) => {
  res.json(todos);
});

/**
 * POST - Skapa ny todo
 */
router.post("/", (req, res) => {
  const { title, description, status } = req.body;

  // Validering
  if (!title || title.length < 3) {
    return res.status(400).json({ message: "Titel måste vara minst 3 tecken." });
  }

  if (description && description.length > 200) {
    return res.status(400).json({ message: "Beskrivning får max vara 200 tecken." });
  }

  const newTodo: Todo = {
    id: randomUUID(),
    title,
    description,
    status: status || "not-started",
  };

  todos.push(newTodo);
  res.status(201).json(newTodo);
});

/**
 * PUT - Uppdatera todo
 */
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { title, description, status } = req.body;

  const todo = todos.find((t) => t.id === id);
  if (!todo) {
    return res.status(404).json({ message: "Todo hittades inte." });
  }

  if (title && title.length < 3) {
    return res.status(400).json({ message: "Titel måste vara minst 3 tecken." });
  }

  if (description && description.length > 200) {
    return res.status(400).json({ message: "Beskrivning får max vara 200 tecken." });
  }

  if (status && !["not-started", "in-progress", "done"].includes(status)) {
    return res.status(400).json({ message: "Ogiltig status." });
  }

  todo.title = title ?? todo.title;
  todo.description = description ?? todo.description;
  todo.status = status ?? todo.status;

  res.json(todo);
});

/**
 * DELETE - Ta bort todo
 */
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  const index = todos.findIndex((t) => t.id === id);
  if (index === -1) {
    return res.status(404).json({ message: "Todo hittades inte." });
  }

  todos.splice(index, 1);
  res.status(204).send();
});

export default router;
