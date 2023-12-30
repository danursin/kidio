import {APIGatewayEventRequestContextJWTAuthorizer, APIGatewayProxyHandlerV2WithJWTAuthorizer} from "aws-lambda";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";

import { Readable } from "stream";

export const handler: APIGatewayProxyHandlerV2WithJWTAuthorizer<APIGatewayEventRequestContextJWTAuthorizer> = async (event) => {
    try {
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
        
        const s3 = new S3Client();
        const response = await s3.send(new GetObjectCommand({
            Bucket: "kidio-audio",
            Key: id
        }));

        const stream = response.Body as Readable;
        
        const audioString = await new Promise<string>((resolve, reject) => {
            const chunks: Uint8Array[] = [];
            stream.on("data", (chunk) => chunks.push(chunk));
            stream.on("error", (error) => reject(error));
            stream.on("end", () => resolve(Buffer.concat(chunks).toString("base64")));
        });
        
        return {
            statusCode: 200,
            isBase64Encoded: true,
            headers: {
                "Content-Type": "audio/webm"
            },
            body: audioString
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