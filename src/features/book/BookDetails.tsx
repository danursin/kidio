import { Button, Grid, Header, Image, Message } from "semantic-ui-react";
import React, { useEffect, useState } from "react";

import { BookItem } from "../../types";
import { Carousel } from "../../components/Carousel";
import { Link } from "react-router-dom";
import Playback from "../../components/Playback";
import SimplePlaceholder from "../../components/SimplePlaceholder";
import config from "../../config";
import { useAuth0 } from "@auth0/auth0-react";
import useDataservice from "../../hooks/useDataService";
import { useParams } from "react-router";

const BookDetails: React.FC = () => {
    const { id = "" } = useParams<{ id: string }>();

    const [book, setBook] = useState<BookItem>();
    const [error, setError] = useState<string>();

    const { query, getAudioUri } = useDataservice();
    const { getAccessTokenSilently } = useAuth0();

    useEffect(() => {
        let wakeLock: WakeLockSentinel;
        (async () => {
            try {
                wakeLock = await navigator.wakeLock.request("screen");
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
                const token = await getAccessTokenSilently();
                const url = `${config.apiBaseUrl}/book/${id}`;
                const response = await fetch(url, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (!response.ok) {
                    throw new Error(await response.text());
                }
                const data = (await response.json()) as BookItem;
                setBook(data);
            } catch (err) {
                setError("Something unexpected happened");
            }
        })();
    }, [query, id]);

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
