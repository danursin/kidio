import { Button, Grid, Image, Message } from "semantic-ui-react";
import React, { useEffect, useState } from "react";

import { Book } from "../../types";
import { Link } from "react-router-dom";
import SimplePlaceholder from "../../components/SimplePlaceholder";
import useDataservice from "../../hooks/useDataService";

const BookList: React.FC = () => {
    const [books, setBooks] = useState<Book[]>();
    const [error, setError] = useState<string>();

    const { query } = useDataservice();

    useEffect(() => {
        (async () => {
            try {
                const data = await query<Book>({
                    table: "Book",
                    select: ["id", "title", "cover_image_url"]
                });
                setBooks(data);
            } catch (err) {
                setError("Something unexpected happened");
            }
        })();
    }, [query]);

    if (error) {
        return <Message content={error} icon="exclamation triangle" error />;
    }

    if (!books) {
        return <SimplePlaceholder />;
    }

    return (
        <>
            <Button as={Link} to={`/book/new/manage`} content="Add New Book" icon="plus circle" />
            <Grid doubling columns="2">
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
