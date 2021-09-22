import { Form, Header } from "semantic-ui-react";
import React, { useEffect, useState } from "react";

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
        setLoading(true);

        if (tempAudio) {
            const formData = new FormData();
            formData.append("file", tempAudio.blob);
            const {
                data: { file_key }
            } = await _axios.post<{ file_key: string }>("/file", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            localTurn.audio_file_key = file_key;
        }

        if (!localTurn.id) {
            // insert
            const response = await insert({
                table: "Turn",
                values: {
                    sort_order: localTurn.sort_order,
                    book_id: localTurn.book_id,
                    audio_file_key: localTurn.audio_file_key || null
                }
            });

            const newID = (response as { id: number }).id;
            localTurn.id = newID;
        } else if (localTurn.audio_file_key !== turn.audio_file_key) {
            // update
            await update({
                table: "Turn",
                values: {
                    audio_file_key: localTurn.audio_file_key
                },
                where: {
                    id: localTurn.id
                }
            });
        }

        setTurn(localTurn);
        setLoading(false);
        setTempAudio(undefined);
    };

    return (
        <Form unstackable onSubmit={onSubmit} loading={loading}>
            <Header content={localTurn.audio_file_key || "No audio file key yet"} size="small" color="grey" textAlign="right" />
            <Form.Group>
                <Form.Input width="12" value={localTurn.sort_order} fluid readOnly label="Sort Order" placeholder="Turn Sort Order" />
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
            {!!tempAudio && <audio controls src={tempAudio.objectURL}></audio>}
            {!!localTurn.audio_file_key && (
                <audio controls src={`${_axios.defaults.baseURL}/file?file_key=${localTurn.audio_file_key}`}></audio>
            )}
            <Form.Button type="submit" content="Save Turn" icon="save" color="teal" fluid disabled={!tempAudio} />
        </Form>
    );
};

export default TurnDetail;
