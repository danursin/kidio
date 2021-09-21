import React, { useState } from "react";

import { Button } from "semantic-ui-react";
import { Turn } from "../../types";

const Home: React.FC = () => {
    const [turn, setTurn] = useState<Turn>({
        id: 0,
        book_id: 0,
        sort_order: 1,
        audio_file_key: ""
    });

    const [recorder, setRecorder] = useState<MediaRecorder>();

    const startRecording = async () => {
        const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        const mediaRecorder = new MediaRecorder(audioStream, { mimeType: "audio/wav" });
        const recordedChunks: BlobPart[] = [];
        mediaRecorder.addEventListener("dataavailable", (e) => {
            if (e.data.size > 0) {
                recordedChunks.push(e.data);
            }
        });

        mediaRecorder.addEventListener("stop", async () => {
            const blob = new Blob(recordedChunks);

            setTurn({ ...turn, audio_file_key: URL.createObjectURL(new Blob(recordedChunks)) });
        });

        mediaRecorder.start();

        setRecorder(mediaRecorder);
    };

    const stopRecording = () => {
        if (recorder && recorder.state === "recording") {
            recorder.stop();
        }
    };

    return (
        <>
            <Button type="button" onClick={startRecording} content="Start Recording" icon="record" />
            <Button type="button" onClick={stopRecording} content="Stop Recording" icon="stop" />
            <audio controls src={turn.audio_file_key}></audio>
        </>
    );
};

export default Home;
