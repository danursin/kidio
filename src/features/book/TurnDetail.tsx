import React, { useEffect, useState } from "react";

import { Form } from "semantic-ui-react";
import { Turn } from "../../types";
import useDataservice from "../../hooks/useDataService";

interface TurnDetailProps {
    turn: Turn;
    setTurn: (turn: Turn) => void;
    onDelete: (turn: Turn) => Promise<void>;
}

interface TempAudio {
    blob: Blob;
    objectURL: string;
}

const TurnDetail: React.FC<TurnDetailProps> = ({ turn, onDelete, setTurn }) => {
    const [localTurn, setLocalTurn] = useState<Turn>({ ...turn });
    const [loading, setLoading] = useState<boolean>(false);
    const [recorder, setRecorder] = useState<MediaRecorder>();
    const [tempAudio, setTempAudio] = useState<TempAudio>();
    const { _axios, insert, update } = useDataservice();

    useEffect(() => {
        setLocalTurn({ ...turn });
    }, [turn]);

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

    const onSubmit = async () => {
        setLoading(true);
        const { id, sort_order, book_id } = localTurn;
        setLoading(true);
        if (localTurn.id) {
            // update
            await update({
                table: "Turn",
                values: {
                    sort_order
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
                    sort_order,
                    book_id
                }
            });

            const newID = (response as { id: number }).id;
            localTurn.id = newID;
            setTurn(localTurn);
        }
        setLoading(false);
    };

    const onSaveTempAudio = async () => {
        if (!tempAudio) {
            return;
        }
        const formData = new FormData();
        formData.append("file", tempAudio.blob);
        const {
            data: { file_key }
        } = await _axios.post<{ file_key: string }>("/file", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });

        await update({
            table: "Turn",
            values: {
                audio_file_key: file_key
            },
            where: {
                id: localTurn.id
            }
        });

        localTurn.audio_file_key = file_key;
        setTurn(localTurn);
        setTempAudio(undefined);
    };

    return (
        <Form unstackable onSubmit={onSubmit} loading={loading}>
            <Form.Group>
                <Form.Input
                    type="number"
                    width="12"
                    value={localTurn.sort_order}
                    fluid
                    label="Sort Order"
                    placeholder="Turn Sort Order"
                    onChange={(e, { value }) => setLocalTurn({ ...localTurn, sort_order: +value })}
                />
                <Form.Button type="button" label="&nbsp;" width="4" icon="trash" color="red" onClick={() => onDelete(turn)} fluid />
            </Form.Group>

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
            {!!tempAudio && (
                <>
                    <audio controls src={tempAudio.objectURL}></audio>
                    <Form.Button type="button" content="Save Audio" icon="audio" onClick={onSaveTempAudio} />
                </>
            )}

            <Form.Button type="submit" content="Save Turn" icon="save" color="teal" fluid />
        </Form>
    );
};

export default TurnDetail;
