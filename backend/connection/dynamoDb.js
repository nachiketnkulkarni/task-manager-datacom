import AWS from "aws-sdk";

AWS.config.update({
  region: "ap-southeast-2",
});

const dynamoDb = new AWS.DynamoDB.DocumentClient();
export default dynamoDb;
