
type DynamoDBItemType = "BOOK" | "TURN" | "USER";

export interface DynamoDBItem {
    PK: string;
    SK: string;
    Type: DynamoDBItemType;
}

type UserItemType = "USER";
export interface UserItem extends DynamoDBItem {
    PK: `${UserItemType}#${string}`;
    SK: `${UserItemType}#${string}`;
    Type: UserItemType;
    email: string;
}

type BookItemType = "BOOK";
export interface BookItem extends DynamoDBItem {
    PK: `${UserItemType}#${string}`;
    SK: `${BookItemType}#${string}`;
    Type: BookItemType;
    id: string
    title: string;
    cover_image_url: string;
    audio_file_key: string | null;
    turns: number[];
}