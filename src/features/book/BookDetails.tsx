import { Button, Grid, Header, Image, Message } from "semantic-ui-react";
import React, { useEffect, useState } from "react";

import { Book } from "../../types";
import { Carousel } from "../../components/Carousel";
import { Link } from "react-router-dom";
import SimplePlaceholder from "../../components/SimplePlaceholder";
import axios from "axios";
import useDataservice from "../../hooks/useDataService";
import { useParams } from "react-router";
import useSound from "../../hooks/useSound";

const BookDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const bookId = +id;

    const [book, setBook] = useState<Book>();
    const [error, setError] = useState<string>();
    const [srcs, setSrcs] = useState<string[]>();
    const { play, pause, playing } = useSound(srcs ?? []);

    const { query, _axios } = useDataservice();

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
                    select: ["id", "title", "cover_image_url"],
                    relations: ["turns"],
                    where: {
                        id: bookId
                    }
                });

                setBook(data);
                setSrcs(data.turns?.map((t) => `${_axios.defaults.baseURL}/file?file_key=${t.audio_file_key}`));
            } catch (err) {
                if (axios.isAxiosError(err)) {
                    setError(err.response?.data || "Something unexpected happened");
                }
            }
        })();
    }, [query, bookId, _axios.defaults.baseURL]);

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
                    <Button
                        size="massive"
                        icon={playing ? "pause" : "play"}
                        content={playing ? "Pause" : "Play"}
                        color="teal"
                        basic={playing}
                        onClick={playing ? pause : play}
                    />
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
