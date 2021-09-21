import { Button, Grid, Header, Image, Message } from "semantic-ui-react";
import React, { useEffect, useState } from "react";

import { Book } from "../../types";
import { Link } from "react-router-dom";
import SimplePlaceholder from "../../components/SimplePlaceholder";
import axios from "axios";
import useDataservice from "../../hooks/useDataService";
import { useParams } from "react-router";

const BookDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const bookId = +id;

    const [book, setBook] = useState<Book>();
    const [error, setError] = useState<string>();
    const [isPlaying, setIsPlaying] = useState<boolean>(false);

    const { query } = useDataservice();

    useEffect(() => {
        (async () => {
            try {
                const [data] = await query<Book>({
                    table: "Book",
                    select: ["id", "title", "cover_image_url"],
                    where: {
                        id: bookId
                    }
                });

                setBook(data);
            } catch (err) {
                if (axios.isAxiosError(err)) {
                    setError(err.response?.data || "Something unexpected happened");
                }
            }
        })();
    }, [query, bookId]);

    const toggleIsPlaying = () => {
        if (isPlaying) {
            setIsPlaying(false);
        } else {
            setIsPlaying(true);
            // play the audio
        }
    };

    if (error) {
        return <Message content={error} icon="exclamation triangle" error />;
    }

    if (!book) {
        return <SimplePlaceholder />;
    }
    return (
        <Grid>
            <Grid.Column textAlign="center">
                <Header content={book.title} icon="book" color="pink" dividing />
                <Button
                    size="massive"
                    icon={isPlaying ? "pause" : "play"}
                    content={isPlaying ? "Pause" : "Play"}
                    color="teal"
                    basic={isPlaying}
                    onClick={toggleIsPlaying}
                />
                <Button size="massive" icon="pencil" content="Edit" as={Link} to={`/book/${id}/manage`} />
                <Image size="medium" centered src={book.cover_image_url} style={{ marginTop: "1rem" }} />
            </Grid.Column>
        </Grid>
    );
};

export default BookDetails;
