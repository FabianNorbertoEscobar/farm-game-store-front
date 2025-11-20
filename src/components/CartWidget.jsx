import { useState } from "react";

export default function CartWidget() {

    const [hover, setHover] = useState(false);

    const styles = {
        icon: {
            fontSize: "32px",
            cursor: "pointer",
            display: "inline-block",
            transition: "transform 0.2s ease, filter 0.2s ease",
            transform: hover ? "scale(1.2) rotate(5deg)" : "scale(1)",
            filter: hover ? "brightness(1.2)" : "none"
        }
    };

    return (
        <span
            style={styles.icon}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            🛒
        </span>
    );
}
