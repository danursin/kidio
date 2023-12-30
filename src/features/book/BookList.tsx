import { Button, Grid, Image, Message } from "semantic-ui-react";
import React, { useEffect, useState } from "react";

import { BookItem } from "../../types";
import { Link } from "react-router-dom";
import SimplePlaceholder from "../../components/SimplePlaceholder";
import config from "../../config";
import { useAuth0 } from "@auth0/auth0-react";

const BookList: React.FC = () => {
    const [books, setBooks] = useState<BookItem[]>();
    const [error, setError] = useState<string>();

    const { getAccessTokenSilently } = useAuth0();

    useEffect(() => {
        (async () => {
            try {
                const token = await getAccessTokenSilently();
                const url = `${config.apiBaseUrl}/book`;
                const response = await fetch(url, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (!response.ok) {
                    throw new Error(await response.text());
                }
                const data = (await response.json()) as BookItem[];
                setBooks(data);
            } catch (err) {
                setError("Something unexpected happened");
            }
        })();
    }, [getAccessTokenSilently]);

    if (error) {
        return <Message content={error} icon="exclamation triangle" error />;
    }

    if (!books) {
        return <SimplePlaceholder />;
    }

    return (
        <>
            <Button as={Link} to={`/book/new/manage`} content="Add New Book" icon="plus circle" />
            <Grid doubling columns="1">
                {books.map((b) => (
                    <Grid.Column key={b.id}>
                        <Image as={Link} to={`/book/${b.id}`} src={b.cover_image_url} />
                    </Grid.Column>
                ))}
            </Grid>
        </>
    );
};

export default BookList;
