export interface Book {
    id: number;
    title: string;
    cover_image_url: string;
    audio_file_key: string | null;
    turns?: Turn[];
}

export interface Turn {
    id: number;
    book_id: number;
    time: number;
}
