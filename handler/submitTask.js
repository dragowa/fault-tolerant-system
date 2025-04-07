const { dynamodb, sendSqsMessage } = require('./utils');

module.exports.submitTask = async (event) => {
    try {
        const body = JSON.parse(event.body);
        const { taskId, payload } = body;

        if (!taskId || !payload) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Missing taskId or payload' }),
            };
        }

        await dynamodb.put({
            TableName: process.env.TABLE_NAME,
            Item: { taskId, payload, status: 'submitted' },
        }).promise();

        const message = { taskId, payload };
        await sendSqsMessage(process.env.MAIN_QUEUE_URL, message);

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Task submitted' }),
        };
    } catch (error) {
        console.error('Error in submitTask:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal server error' }),
        };
    }
};