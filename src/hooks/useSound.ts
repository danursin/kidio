import { useCallback, useEffect, useState } from "react";

interface UseSoundOutput {
    paused: boolean;
    ready: boolean;
    toggleState: () => void;
}

const useSound = (srcs: string[]): UseSoundOutput => {
    const [srcIndex, setSrcIndex] = useState<number>(0);
    const [audio] = useState<HTMLAudioElement>(new Audio(srcs[srcIndex]));
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [ready, setReady] = useState<boolean>(false);

    useEffect(() => {
        setSrcIndex(0);
        setReady(false);
    }, [srcs]);

    useEffect(() => {
        function handleCanplaythrough() {
            setReady(true);
            if (isPlaying) {
                audio.play();
            }
        }

        const newSrc = srcs[srcIndex];
        audio.src = newSrc;
        audio.addEventListener("canplaythrough", handleCanplaythrough);

        return () => {
            audio.removeEventListener("canplaythrough", handleCanplaythrough);
        };
    }, [audio, isPlaying, srcIndex, srcs]);

    const toggleState = useCallback(() => {
        if (audio.paused) {
            // play
            audio.play();
            audio.addEventListener("ended", () => {
                const newSrcIndex = srcIndex + 1;
                if (srcIndex <= srcs.length) {
                    setSrcIndex(newSrcIndex);
                }
            });
            setIsPlaying(true);
        } else {
            // pause
            audio.pause();
            setIsPlaying(false);
        }
    }, [audio, srcIndex, srcs.length]);

    return {
        ready,
        paused: audio.paused,
        toggleState
    };
};

export default useSound;
