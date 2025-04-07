# Fault-Tolerant Backend System

## Overview
The system simulates a data processing pipeline where:
- Tasks are submitted via an API endpoint.
- Tasks are queued in SQS and processed asynchronously by Lambda.
- Failures (simulated at a 30% rate) are retried with exponential backoff (30s, 60s).
- Tasks failing after 3 attempts are sent to a DLQ and logged in CloudWatch.

## Architecture

- **API Gateway**: Exposes `POST /tasks` to submit tasks.
- **submitTask Lambda**: Validates and queues tasks, stores metadata in DynamoDB.
- **SQS Main Queue**: Holds tasks for processing with a redrive policy (`maxReceiveCount: 3`).
- **processTask Lambda**: Processes tasks, simulates failures, and retries with backoff.
- **SQS DLQ**: Collects tasks that fail after 3 attempts.
- **monitorDLQ Lambda**: Logs failed tasks to CloudWatch.
- **DynamoDB**: Tracks task status (`submitted`, `completed`).

## Specifications
- **Runtime**: Node.js 20.x (AWS Lambda).
- **Services**: API Gateway, Lambda, SQS, DynamoDB, CloudWatch.
- **Framework**: Serverless Framework.
- **Retry Strategy**: Exponential backoff (30s, 60s) for 2 retries, then DLQ.


## Send tasks via the API:
curl -X POST https://pwjavntxcb.execute-api.us-east-1.amazonaws.com/dev/tasks  \
-H "Content-Type: application/json" \
-d '{"taskId": "task1", "payload": {"data": "test"}}'