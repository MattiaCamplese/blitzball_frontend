import { motion, type Variants } from "framer-motion";

const containerVariants: Variants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.07,
        },
    },
};

const letterVariants: Variants = {
    hidden: { opacity: 0, y: -60, rotateX: -90 },
    visible: {
        opacity: 1,
        y: 0,
        rotateX: 0,
        transition: {
            type: "spring" as const,
            damping: 12,
            stiffness: 200,
        },
    },
};

interface AnimatedTitleProps {
    parts: {
        text: string;
        className?: string;
    }[];
    className?: string;
}

const AnimatedTitle = ({ parts, className = "" }: AnimatedTitleProps) => {
    return (
        <motion.h1
            className={`font-extrabold tracking-tight leading-tight mb-4 text-4xl sm:text-5xl lg:text-6xl ${className}`}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{ perspective: 600 }}
        >
            {parts.map((part, partIndex) =>
                part.text.split("").map((char, i) =>
                    char === " " ? (
                        <motion.span
                            key={`${partIndex}-${i}`}
                            variants={letterVariants}
                            className="inline-block w-3 sm:w-4"
                        />
                    ) : (
                        <motion.span
                            key={`${partIndex}-${i}`}
                            variants={letterVariants}
                            className={`inline-block ${part.className ?? "text-white"}`}
                        >
                            {char}
                        </motion.span>
                    )
                )
            )}
        </motion.h1>
    );
};

export default AnimatedTitle;