import { Book, Turn } from "../../types";
import { Button, Form, Header, Image, List, Message } from "semantic-ui-react";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";

import SimplePlaceholder from "../../components/SimplePlaceholder";
import TurnDetail from "./TurnDetail";
import axios from "axios";
import useDataservice from "../../hooks/useDataService";

const Manage: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    const [book, setBook] = useState<Book | undefined>(() => {
        if (id === "new") {
            return {
                id: 0,
                title: "",
                cover_image_url: ""
            };
        }
    });
    const [error, setError] = useState<string>();
    const [loading, setLoading] = useState<boolean>(false);
    const history = useHistory();

    const { query, destroy, insert, update } = useDataservice();

    useEffect(() => {
        if (id === "new") {
            return;
        }

        (async () => {
            try {
                const [data] = await query<Book>({
                    table: "Book",
                    select: ["id", "title", "cover_image_url"],
                    relations: ["turns"],
                    where: {
                        id: +id
                    }
                });

                setBook(data);
            } catch (err) {
                if (axios.isAxiosError(err)) {
                    setError(err.response?.data || "Something unexpected happened");
                }
            }
        })();
    }, [query, id]);

    const onSubmit = async () => {
        if (!book) {
            return;
        }
        const { id, cover_image_url, title } = book;
        setLoading(true);
        if (book.id) {
            // update
            await update({
                table: "Book",
                values: {
                    cover_image_url,
                    title
                },
                where: {
                    id
                }
            });
        } else {
            // insert
            const response = await insert({
                table: "Book",
                values: {
                    cover_image_url,
                    title
                }
            });

            setLoading(false);
            const newID = (response as { id: number }).id;
            history.push(`/book/${newID}/manage`);
        }
        setLoading(false);
    };

    const onDelete = async (turn: Turn) => {
        if (!book?.turns) {
            return;
        }

        if (!window.confirm("Delete this turn?")) {
            return;
        }

        const existingIndex = book.turns.findIndex((t) => t === turn);
        book.turns.splice(existingIndex, 1);

        setBook({ ...book });

        if (!turn.id) {
            // for a new one only in memory
            return;
        }
        await destroy({
            table: "Turn",
            where: {
                id: turn.id
            }
        });
    };

    const onSetTurn = (localTurn: Turn) => {
        if (!book?.turns) {
            return;
        }
        const existingIndex = book.turns.findIndex((t) => t.sort_order === localTurn.sort_order);
        book.turns[existingIndex] = localTurn;
        setBook({ ...book, turns: [...book.turns] });
    };

    if (!book) {
        return <SimplePlaceholder />;
    }

    return (
        <>
            <Form onSubmit={onSubmit} error={!!error} loading={loading}>
                <Header content={book.title || "New Book"} subheader={`Book ID ${book.id || "NEW"}`} />
                <Message content={error} icon="exclamation triangle" error />
                <Form.Input
                    type="text"
                    value={book.title}
                    label="Book Title"
                    required
                    placeholder="Book Title"
                    onChange={(e, { value }) => setBook({ ...book, title: value })}
                />
                <Form.Input
                    type="text"
                    value={book.cover_image_url}
                    required
                    label="Cover Image URL"
                    placeholder="Cover Image URL"
                    onChange={(e, { value }) => setBook({ ...book, cover_image_url: value })}
                />

                <Form.Button type="submit" content="Save Book" icon="save" color="teal" fluid />

                {!!book.cover_image_url && <Image size="large" centered src={book.cover_image_url} style={{ marginTop: "1rem" }} />}
            </Form>

            {!!book.turns && (
                <List>
                    {book.turns.map((t) => (
                        <List.Item key={t.id}>
                            <TurnDetail turn={t} onDelete={onDelete} setTurn={onSetTurn} />
                        </List.Item>
                    ))}
                </List>
            )}

            {!!book.id && (
                <Button
                    type="button"
                    icon="plus circle"
                    content="Add Turn"
                    fluid
                    color="purple"
                    disabled={!!book.turns?.some((t) => !t.id)}
                    onClick={() => {
                        const newTurn: Turn = {
                            id: 0,
                            book_id: +id,
                            sort_order: 1,
                            audio_file_key: ""
                        };
                        if (!book.turns) {
                            book.turns = [newTurn];
                        } else {
                            book.turns.push({
                                ...newTurn,
                                sort_order: book.turns.length + 1
                            });
                        }
                        setBook({ ...book });
                    }}
                />
            )}
        </>
    );
};

export default Manage;
