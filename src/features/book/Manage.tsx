import { Form, Header, Image, List, Message } from "semantic-ui-react";
import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";

import { BookItem } from "../../types";
import SimplePlaceholder from "../../components/SimplePlaceholder";
import duration from "humanize-duration";
import useDataservice from "../../hooks/useDataService";
import { useParams } from "react-router";

interface TempAudio {
    blob: Blob;
    objectURL: string;
}

const Manage: React.FC = () => {
    const { id = "new" } = useParams<{ id: string }>();
    const [recorder, setRecorder] = useState<MediaRecorder>();
    const [tempAudio, setTempAudio] = useState<TempAudio>();
    const [recordStartTime, setRecordStartTime] = useState<number>(+new Date());
    const [turnTimes, setTurnTimes] = useState<number[]>([]);
    const [src, setSrc] = useState<string>();
    const [book, setBook] = useState<BookItem | undefined>(() => {
        if (id === "new") {
            return {
                id: "",
                title: "",
                cover_image_url: "",
                audio_file_key: null,
                turns: []
            };
        }
    });
    const [error, setError] = useState<string>();
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    const { query, insert, update, destroy, getAudioUri, putAudioFile } = useDataservice();

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
                setError("Something unexpected happened");
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
            navigate(`/book/${newID}/manage`, { replace: true });
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

        await destroy({
            table: "Turn",
            where: {
                book_id: id
            }
        });

        await Promise.all([
            update({
                table: "Book",
                values: {
                    audio_file_key: book.audio_file_key
                },
                where: {
                    id: id
                }
            }),
            turnTimes.length
                ? insert({
                      table: "Turn",
                      values: turnTimes.map((t) => ({
                          time: t,
                          book_id: id
                      }))
                  })
                : undefined
        ]);

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
        setRecordStartTime(+new Date());
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

    const addTurn = () => {
        setTurnTimes((times) => {
            const now = +new Date();
            const time = now - recordStartTime;
            return [...times, time];
        });
    };

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

                    <Form.Group widths="equal">
                        <Form.Button type="button" content="Add Page Turn" icon="bookmark" fluid color="purple" onClick={addTurn} />
                    </Form.Group>

                    <List divided>
                        {turnTimes.map((t, index) => (
                            <List.Item key={t} description={`Turn ${index + 1}`} content={duration(t, { round: true })} />
                        ))}
                    </List>

                    {!!tempAudio && <audio controls src={tempAudio.objectURL}></audio>}
                    {!!src && <audio controls src={src}></audio>}
                    <Form.Button type="submit" content="Save Audio" icon="save" color="teal" fluid disabled={!tempAudio} />
                </Form>
            )}
        </>
    );
};

export default Manage;
