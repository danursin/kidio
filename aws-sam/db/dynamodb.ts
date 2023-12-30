import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({
    region: "us-east-1"
});

const dynamodb = DynamoDBDocumentClient.from(client, { marshallOptions: {removeUndefinedValues: true }});

export const TABLE_NAME = "kidio";

export default dynamodb;