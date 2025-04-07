module.exports.monitorDLQ = async (event) => {
    for (const record of event.Records) {
        const message = JSON.parse(record.body);
        const { taskId, payload } = message;
        console.log(`Task ${taskId} failed after maximum retries. Payload: ${JSON.stringify(payload)}`);
    }
};