import { useCallback, useEffect, useState } from "react";

interface UseSoundOutput {
    playing: boolean;
    play: () => Promise<void>;
    pause: () => void;
}

const useSound = (src: string): UseSoundOutput => {
    const [audio] = useState<HTMLAudioElement>(new Audio(src));
    const [playing, setPlaying] = useState<boolean>(false);

    useEffect(() => {
        audio.src = src;
        const callback = () => {
            setPlaying(false);
        };
        audio.addEventListener("ended", callback);
        return () => {
            audio.removeEventListener("ended", callback);
        };
    }, [audio, src]);

    const play = useCallback(async () => {
        setPlaying(true);
        await audio.play();
    }, [audio]);

    const pause = useCallback(() => {
        audio.pause();
        setPlaying(false);
    }, [audio]);

    return {
        play,
        pause,
        playing
    };
};

export default useSound;
