import {APIGatewayEventRequestContextJWTAuthorizer, APIGatewayProxyHandlerV2WithJWTAuthorizer} from "aws-lambda";

import { BookItem } from "../../src/types"
import { GetCommand } from "@aws-sdk/lib-dynamodb";
import dynamodb from "../db/dynamodb";

export const handler: APIGatewayProxyHandlerV2WithJWTAuthorizer<APIGatewayEventRequestContextJWTAuthorizer> = async (event) => {
    try {
    
        console.log(event);
        
        const { claims } = event.requestContext.authorizer.jwt;
        const sub = claims.sub as string;
        
        const { id } = event.pathParameters ?? {};
        if(!id) {
            return {
                statusCode: 400,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ message: "id is required" })
            };
        }
        
        const response = await dynamodb.send(new GetCommand({
            TableName: "kidio",
            Key: {
                PK: `USER#${sub}`,
                SK: `BOOK#${id}`
            }
        }));
        
        const book = response.Item as BookItem;
        
        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(book)
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