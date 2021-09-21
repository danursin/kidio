export interface Book {
    id: number;
    title: string;
    cover_image_url: string;
    turns?: Turn[];
}

export interface Turn {
    id: number;
    book_id: number;
    sort_order: number;
    audio_file_key: string;
}
