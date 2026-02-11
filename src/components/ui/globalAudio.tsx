import { useState } from "react";
import { motion } from "framer-motion";
import audio from "@/audio/globalAudio";

const GlobalAudio = () => {
    const [isPlaying, setIsPlaying] = useState(!audio.paused);

    const togglePlay = async () => {
        try {
            if (audio.paused) {
                await audio.play();
                setIsPlaying(true);
            } else {
                audio.pause();
                setIsPlaying(false);
            }
        } catch (e) {
            console.error("Audio error:", e);
        }
    };

    return (
        <motion.div onClick={togglePlay} animate={isPlaying ? { rotate: 360 } : { rotate: 0 }} transition={isPlaying ? { repeat: Infinity, duration: 2, ease: "linear" } : { duration: 0.3 }} style={{ originX: 0.5, originY: 0.5 }} >
            <img src="/Palla.png" alt="Music" className="w-16 h-16 drop-shadow-xl" />
        </motion.div>
    );
};

export default GlobalAudio;













