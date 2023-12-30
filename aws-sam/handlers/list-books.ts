import {APIGatewayEventRequestContextJWTAuthorizer, APIGatewayProxyHandlerV2WithJWTAuthorizer} from "aws-lambda";

import { BookItem } from "../../src/types"
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import dynamodb from "../db/dynamodb";

export const handler: APIGatewayProxyHandlerV2WithJWTAuthorizer<APIGatewayEventRequestContextJWTAuthorizer> = async (event) => {
    try {
        console.log(event);
        const { claims } = event.requestContext.authorizer.jwt;

        console.log(claims);
        const sub = claims.sub as string;

        const { Items } = await dynamodb.send(new QueryCommand({
            TableName: "kidio",
            KeyConditionExpression: "PK = :pk",
            ExpressionAttributeValues: {
                ":pk": `USER#${sub}`
            }
        }));

        const books = Items as BookItem[];
        
        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(books)
        };  
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message: error.message })
        };
    }
};