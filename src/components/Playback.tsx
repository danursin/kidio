import React, { useCallback, useEffect, useState } from "react";

import { Button } from "semantic-ui-react";
import useDataservice from "../hooks/useDataService";

interface PlaybackProps {
    audio_file_key: string | null;
    turns?: number[];
}

const turnSrc = "/sounds/bell.mp3";

const Playback: React.FC<PlaybackProps> = ({ audio_file_key, turns }) => {
    const [mainAudio, setMainAudio] = useState<HTMLAudioElement>(new Audio());
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [turnIndex, setTurnIndex] = useState<number>(0);
    const { getAudioUri } = useDataservice();

    const playFullSound = useCallback((src: string) => {
        const audio = new Audio(src);
        return new Promise((resolve) => {
            audio.addEventListener("ended", resolve);
            audio.play();
        });
    }, []);

    useEffect(() => {
        if (!audio_file_key) {
            return;
        }
        (async () => {
            const audioURI = await getAudioUri(audio_file_key);
            const newMainAudio = new Audio(audioURI);
            newMainAudio.addEventListener("ended", () => {
                setIsPlaying(false);
                setTurnIndex(0);
            });
            setMainAudio(newMainAudio);
        })();
    }, [audio_file_key, getAudioUri]);

    useEffect(() => {
        if (!isPlaying || !turns?.length) {
            return;
        }

        const interval = setInterval(async () => {
            const currentTurn = turns[turnIndex];
            const audioTimeMs = mainAudio.currentTime * 1000;
            if (currentTurn && audioTimeMs >= currentTurn) {
                clearInterval(interval);
                mainAudio.pause();
                setTurnIndex((current) => current + 1);
                await playFullSound(turnSrc);
                await mainAudio.play();
            }
            console.log(`Audio current time: ${mainAudio.currentTime}`);
        }, 100);

        return () => {
            console.log("Clearing interval");
            clearInterval(interval);
        };
    }, [isPlaying, mainAudio, playFullSound, turnIndex, turns]);

    const play = async () => {
        await mainAudio.play();
        setIsPlaying(true);
    };

    const pause = () => {
        mainAudio.pause();
        setIsPlaying(false);
    };

    return (
        <>
            <Button
                size="massive"
                disabled={!mainAudio.src}
                icon={isPlaying ? "pause" : "play"}
                content={isPlaying ? "Pause" : "Play"}
                color="teal"
                basic={isPlaying}
                onClick={isPlaying ? pause : play}
            />
        </>
    );
};

export default Playback;
