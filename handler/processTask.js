const { sqs, updateTaskStatus } = require('./utils');

module.exports.processTask = async (event) => {

    for (const record of event.Records) {
        try {
            const message = JSON.parse(record.body);
            const { taskId } = message;

            // Simulate processing with 30% failure rate
            if (Math.random() < 1) {
                throw new Error('Simulated processing failure');
            }

            await updateTaskStatus(process.env.TABLE_NAME, taskId, 'completed');
            console.log(`Task ${taskId} processed successfully`);
        } catch (error) {
            const message = JSON.parse(record.body);
            const { taskId } = message;
            const receiveCount = parseInt(record.attributes.ApproximateReceiveCount);

            console.error(`Task ${taskId} failed on attempt ${receiveCount}: ${error.message}`);

            // Exponential backoff for retries
            if (receiveCount < 3) {
                const newTimeout = 30 * Math.pow(2, receiveCount - 1);
                await sqs.changeMessageVisibility({
                    QueueUrl: process.env.MAIN_QUEUE_URL,
                    ReceiptHandle: record.receiptHandle,
                    VisibilityTimeout: newTimeout,
                }).promise();
            }
        }
    }
};