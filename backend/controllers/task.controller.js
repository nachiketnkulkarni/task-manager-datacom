import Task from "../models/task.schema.js";
import * as response from "../utils/responseHandler.js";

export const getAllTasks = async (req, res) => {
  const { page = 1, limit = 10, title = "", status = "" } = req.query;
  const skip = (page - 1) * limit;

  const query = {};
  if (title) query.title = { $regex: title, $options: "i" };
  if (status) query.status = status;

  const [tasks, total] = await Promise.all([
    Task.find(query).sort({ updatedAt: -1 }).skip(skip).limit(limit),
    Task.countDocuments(query),
  ]);

  response.ok(
    res,
    {
      tasks,
      total,
      page,
      pages: Math.ceil(total / limit),
    },
    "Tasks fetched successfully."
  );
};

export const createTask = async (req, res) => {
  const task = req.body;

  const createdTask = await Task.create(task);

  response.created(res, createdTask.toJSON(), "Task created successfully.");
};

export const getTaskById = async (req, res) => {
  const { id } = req.params;

  if (!id) return response.badRequest(res, "Task ID is required");

  const task = await Task.findById(id);

  if (!task) {
    return response.notFound(res, `No task found with ID: ${id}`);
  }

  response.ok(res, task.toJSON(), "Task found.");
};

export const updateTask = async (req, res) => {
  const { id } = req.params;
  const task = req.body;

  if (!id) return response.badRequest(res, "Task ID is required");
  if (!task) return response.badRequest(res, "Provide updated task body");

  const taskToUpdate = await Task.findByIdAndUpdate(id, task);

  if (!taskToUpdate)
    return response.badRequest(res, `Task not found with id : ${id}`);

  const updatedTask = await Task.findById(id);

  response.accepted(
    res,
    updatedTask.toJSON(),
    `Task updated successfully for ID : ${id}`
  );
};

export const deleteTask = async (req, res) => {
  const { id } = req.params;
  if (!id) return response.badRequest(res, "Task ID is required");

  const taskToDelete = await Task.findByIdAndDelete(id);

  if (!taskToDelete)
    return response.badRequest(res, `Task not found with id : ${id}`);

  response.ok(res, null, "Task deleted successfully.");
};
