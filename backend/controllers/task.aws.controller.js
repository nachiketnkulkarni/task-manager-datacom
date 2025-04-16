import dynamoDb from "../connection/dynamoDb.js";
import {
  createTaskObject,
  getTaskUpdateParams,
} from "../models/task.aws.schema.js";
import * as response from "../utils/responseHandler.js";
import dotenv from "dotenv";
dotenv.config();

const TABLE_NAME = process.env.AWS_DEFAULT_TABLE_NAME;

export const createTask = async (req, res, next) => {
  try {
    const { title, description, status } = req.body;

    // Step 1: Check for existing task with the same title
    const duplicateCheck = await dynamoDb
      .scan({
        TableName: TABLE_NAME,
        FilterExpression: "#title = :titleVal",
        ExpressionAttributeNames: {
          "#title": "title",
        },
        ExpressionAttributeValues: {
          ":titleVal": title,
        },
      })
      .promise();

    if (duplicateCheck.Items.length > 0) {
      return response.badRequest(res, "Task title must be unique.");
    }

    // Step 2: Create the task if no duplicate
    const task = createTaskObject({ title, description, status });

    await dynamoDb
      .put({
        TableName: TABLE_NAME,
        Item: task,
      })
      .promise();

    response.created(res, task, "Task created successfully.");
  } catch (err) {
    next(err);
  }
};

export const getAllTasks = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, title = "", status = "" } = req.query;
    const pageLimit = parseInt(limit);
    const currentPage = parseInt(page);

    // Scan all items (not efficient for large tables)
    const result = await dynamoDb.scan({ TableName: TABLE_NAME }).promise();
    let tasks = result.Items || [];

    // Apply filters manually
    if (title) {
      const titleRegex = new RegExp(title, "i");
      tasks = tasks.filter((task) => titleRegex.test(task.title));
    }

    if (status) {
      tasks = tasks.filter((task) => task.status === status);
    }

    // Sort by updatedAt (desc)
    tasks.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    // Pagination
    const total = tasks.length;
    const startIndex = (currentPage - 1) * pageLimit;
    const endIndex = startIndex + pageLimit;
    const paginatedTasks = tasks.slice(startIndex, endIndex);

    response.ok(
      res,
      {
        tasks: paginatedTasks,
        total,
        page: currentPage,
        pages: Math.ceil(total / pageLimit),
      },
      "Tasks fetched successfully."
    );
  } catch (err) {
    next(err);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      UpdateExpression,
      ExpressionAttributeValues,
      ExpressionAttributeNames,
    } = getTaskUpdateParams(req.body);

    const result = await dynamoDb
      .update({
        TableName: TABLE_NAME,
        Key: { id },
        UpdateExpression,
        ExpressionAttributeValues,
        ExpressionAttributeNames, // ✅ must be included explicitly
        ReturnValues: "ALL_NEW",
      })
      .promise();

    res.status(200).json({ message: "Task updated", task: result.Attributes });
  } catch (err) {
    next(err);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    await dynamoDb.delete({ TableName: TABLE_NAME, Key: { id } }).promise();
    response.ok(res, null, "Task deleted successfully.");
  } catch (err) {
    next(err);
  }
};

export const getTaskById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await dynamoDb
      .get({
        TableName: TABLE_NAME,
        Key: { id },
      })
      .promise();

    if (!result.Item) {
      return response.notFound(res, `No task found with ID: ${id}`);
    }

    response.ok(res, result.Item, "Task found.");
  } catch (err) {
    next(err);
  }
};
