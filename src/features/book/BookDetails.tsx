import { Button, Grid, Header, Image, Message } from "semantic-ui-react";
import React, { useEffect, useState } from "react";

import { Book } from "../../types";
import { Carousel } from "../../components/Carousel";
import { Link } from "react-router-dom";
import Playback from "../../components/Playback";
import SimplePlaceholder from "../../components/SimplePlaceholder";
import useDataservice from "../../hooks/useDataService";
import { useParams } from "react-router";

const BookDetails: React.FC = () => {
    const { id = "" } = useParams<{ id: string }>();
    const bookId = +id;

    const [book, setBook] = useState<Book>();
    const [error, setError] = useState<string>();

    const { query, getAudioUri } = useDataservice();

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let wakeLock: any;
        (async () => {
            try {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                wakeLock = await (navigator as any).wakeLock.request("screen");
            } catch (err) {
                console.log("No wakelock available");
            }
        })();

        return () => {
            if (wakeLock) {
                wakeLock.release();
            }
        };
    }, []);

    useEffect(() => {
        (async () => {
            try {
                const [data] = await query<Book>({
                    table: "Book",
                    select: ["id", "title", "cover_image_url", "audio_file_key"],
                    relations: ["turns"],
                    where: {
                        id: bookId
                    }
                });

                setBook(data);
            } catch (err) {
                setError("Something unexpected happened");
            }
        })();
    }, [query, bookId, getAudioUri]);

    if (error) {
        return <Message content={error} icon="exclamation triangle" error />;
    }

    if (!book) {
        return <SimplePlaceholder />;
    }
    return (
        <Grid>
            <Grid.Row>
                <Grid.Column textAlign="center">
                    <Header content={book.title} icon="book" color="pink" dividing />
                    <Playback audio_file_key={book.audio_file_key} turns={book.turns} />
                    <Button size="massive" icon="pencil" content="Edit" as={Link} to={`/book/${id}/manage`} />
                    <Image size="large" centered src={book.cover_image_url} style={{ marginTop: "1rem" }} />
                </Grid.Column>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column>
                    <Carousel />
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
};

export default BookDetails;
