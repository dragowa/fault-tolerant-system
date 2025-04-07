const AWS = require('aws-sdk');

// Initialize AWS SDK clients
const sqs = new AWS.SQS();
const dynamodb = new AWS.DynamoDB.DocumentClient();

// Utility to send a message to SQS
const sendSqsMessage = async (queueUrl, message) => {
    await sqs.sendMessage({
        QueueUrl: queueUrl,
        MessageBody: JSON.stringify(message),
    }).promise();
};

// Utility to update DynamoDB status
const updateTaskStatus = async (tableName, taskId, status) => {
    await dynamodb.update({
        TableName: tableName,
        Key: { taskId },
        UpdateExpression: 'set #status = :status',
        ExpressionAttributeNames: { '#status': 'status' },
        ExpressionAttributeValues: { ':status': status },
    }).promise();
};

module.exports = {
    sqs,
    dynamodb,
    sendSqsMessage,
    updateTaskStatus,
};