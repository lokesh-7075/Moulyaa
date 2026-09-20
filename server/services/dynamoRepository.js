/**
 * ⚡ Amazon DynamoDB Unified Data Repository
 * Provides full CRUD and secondary index query capabilities for all Moulyasree entities
 */
const { 
  PutCommand, 
  GetCommand, 
  QueryCommand, 
  ScanCommand, 
  UpdateCommand, 
  DeleteCommand 
} = require("@aws-sdk/lib-dynamodb");
const { getDynamoDocClient } = require("./dynamoService");

/**
 * Put / Create or Overwrite an Item in DynamoDB
 */
const putItem = async (tableName, item) => {
  const docClient = getDynamoDocClient();
  const command = new PutCommand({
    TableName: tableName,
    Item: {
      ...item,
      updatedAt: new Date().toISOString()
    }
  });
  await docClient.send(command);
  return item;
};

/**
 * Get Item by Primary Key
 */
const getItem = async (tableName, key) => {
  const docClient = getDynamoDocClient();
  const command = new GetCommand({
    TableName: tableName,
    Key: key
  });
  const response = await docClient.send(command);
  return response.Item || null;
};

/**
 * Scan all items in a table (with optional limit)
 */
const scanTable = async (tableName, limit = 50) => {
  const docClient = getDynamoDocClient();
  const command = new ScanCommand({
    TableName: tableName,
    Limit: limit
  });
  const response = await docClient.send(command);
  return response.Items || [];
};

/**
 * Query items by Global Secondary Index (e.g. ownerId, userId, email)
 */
const queryGSI = async (tableName, indexName, partitionKeyName, partitionKeyValue) => {
  const docClient = getDynamoDocClient();
  const command = new QueryCommand({
    TableName: tableName,
    IndexName: indexName,
    KeyConditionExpression: "#pk = :val",
    ExpressionAttributeNames: {
      "#pk": partitionKeyName
    },
    ExpressionAttributeValues: {
      ":val": partitionKeyValue
    }
  });
  const response = await docClient.send(command);
  return response.Items || [];
};

/**
 * Delete Item by Primary Key
 */
const deleteItem = async (tableName, key) => {
  const docClient = getDynamoDocClient();
  const command = new DeleteCommand({
    TableName: tableName,
    Key: key
  });
  await docClient.send(command);
  return { success: true };
};

module.exports = {
  putItem,
  getItem,
  scanTable,
  queryGSI,
  deleteItem
};
