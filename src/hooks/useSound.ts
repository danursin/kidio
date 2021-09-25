import { useCallback, useState } from "react";

interface UseSoundOutput {
    playing: boolean;
    play: () => Promise<void>;
    pause: () => void;
}

const useSound = (srcs: string[]): UseSoundOutput => {
    const [audio] = useState<HTMLAudioElement>(new Audio());
    const [playing, setPlaying] = useState<boolean>(false);

    const playSound = useCallback(
        async (src: string) => {
            audio.src = src;
            await new Promise((resolve) => {
                audio.addEventListener("canplaythrough", resolve);
            });
            audio.play();
            return new Promise((resolve) => {
                audio.addEventListener("ended", resolve);
            });
        },
        [audio]
    );

    const play = useCallback(async () => {
        setPlaying(true);
        for (let i = 0; i < srcs.length; i += 1) {
            await playSound(srcs[i]);
            if (i !== srcs.length - 1) {
                await playSound("/sounds/bell.mp3");
            }
        }
        setPlaying(false);
    }, [playSound, srcs]);

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
