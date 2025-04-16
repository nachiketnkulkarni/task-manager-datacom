import { v4 as uuidv4 } from "uuid";

/**
 * Creates a task object for DynamoDB
 */
export function createTaskObject({ title, description, status }) {
  return {
    id: uuidv4(),
    title,
    description,
    status,
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Generates update expression and attribute values
 */
export function getTaskUpdateParams({ title, description, status }) {
  return {
    UpdateExpression:
      "set #title = :t, #description = :d, #status = :s, updatedAt = :u",
    ExpressionAttributeNames: {
      "#title": "title",
      "#description": "description",
      "#status": "status",
    },
    ExpressionAttributeValues: {
      ":t": title,
      ":d": description,
      ":s": status,
      ":u": new Date().toISOString(),
    },
  };
}
