import { Form, Header, Image, Message } from "semantic-ui-react";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";

import { Book } from "../../types";
import { Link } from "react-router-dom";
import SimplePlaceholder from "../../components/SimplePlaceholder";
import axios from "axios";
import useDataservice from "../../hooks/useDataService";

interface TempAudio {
    blob: Blob;
    objectURL: string;
}

const Manage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [recorder, setRecorder] = useState<MediaRecorder>();
    const [tempAudio, setTempAudio] = useState<TempAudio>();
    const [src, setSrc] = useState<string>();
    const [book, setBook] = useState<Book | undefined>(() => {
        if (id === "new") {
            return {
                id: 0,
                title: "",
                cover_image_url: "",
                audio_file_key: null
            };
        }
    });
    const [error, setError] = useState<string>();
    const [loading, setLoading] = useState<boolean>(false);
    const history = useHistory();

    const { query, insert, update, getAudioUri, putAudioFile } = useDataservice();

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

                if (data.audio_file_key) {
                    const dataUri = await getAudioUri(data.audio_file_key);
                    setSrc(dataUri);
                }
                setBook(data);
            } catch (err) {
                if (axios.isAxiosError(err)) {
                    setError(err.response?.data || "Something unexpected happened");
                }
            }
        })();
    }, [query, id, getAudioUri]);

    const onDetailSubmit = async () => {
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

    const onAudioSubmit = async () => {
        if (!tempAudio || !book) {
            return;
        }
        setLoading(true);

        if (tempAudio) {
            book.audio_file_key = await putAudioFile(tempAudio.blob);
        }

        await update({
            table: "Book",
            values: {
                audio_file_key: book.audio_file_key
            },
            where: {
                id: id
            }
        });

        setLoading(false);
        setTempAudio(undefined);
    };

    const startRecording = async () => {
        const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        const mediaRecorder = new MediaRecorder(audioStream, { mimeType: "audio/webm" });
        const recordedChunks: BlobPart[] = [];
        mediaRecorder.addEventListener("dataavailable", (e) => {
            if (e.data.size > 0) {
                recordedChunks.push(e.data);
            }
        });

        mediaRecorder.addEventListener("stop", async () => {
            const blob = new Blob(recordedChunks);
            const objectURL = URL.createObjectURL(blob);
            setTempAudio({ blob, objectURL });
        });

        mediaRecorder.start();

        setRecorder(mediaRecorder);
    };

    const stopRecording = () => {
        if (recorder && recorder.state === "recording") {
            recorder.stop();
        }
    };

    if (!book) {
        return <SimplePlaceholder />;
    }

    return (
        <>
            <Form onSubmit={onDetailSubmit} error={!!error} loading={loading}>
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

                {!!book.cover_image_url && (
                    <Image size="large" centered src={book.cover_image_url} style={{ marginTop: "1rem" }} as={Link} to={`/book/${id}`} />
                )}
            </Form>

            {!!book.id && (
                <Form unstackable onSubmit={onAudioSubmit} loading={loading}>
                    <Header content={book.audio_file_key || "No audio file key yet"} size="small" color="grey" textAlign="right" />

                    <Form.Group>
                        <Form.Button
                            type="button"
                            onClick={startRecording}
                            content="Record"
                            icon="record"
                            width="8"
                            basic
                            color="grey"
                            fluid
                            disabled={recorder?.state === "recording"}
                        />
                        <Form.Button
                            type="button"
                            onClick={stopRecording}
                            content="Stop"
                            icon="stop"
                            width="8"
                            basic
                            color="red"
                            fluid
                            disabled={recorder?.state !== "recording"}
                        />
                    </Form.Group>
                    {!!tempAudio && <audio controls src={tempAudio.objectURL}></audio>}
                    {!!src && <audio controls src={src}></audio>}
                    <Form.Button type="submit" content="Save Audio" icon="save" color="teal" fluid disabled={!tempAudio} />
                </Form>
            )}
        </>
    );
};

export default Manage;
