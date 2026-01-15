import { useState } from "react";
import { useCartContext } from "../context/cartContext";

export default function CartWidget() {

    const [hover, setHover] = useState(false);
    const { countItemsInCart } = useCartContext();

    const itemCount = countItemsInCart();

    const styles = {
        container: {
            position: "relative",
            display: "inline-block"
        },
        icon: {
            fontSize: "32px",
            cursor: "pointer",
            display: "inline-block",
            transition: "transform 0.2s ease, filter 0.2s ease",
            transform: hover ? "scale(1.2) rotate(5deg)" : "scale(1)",
            filter: hover ? "brightness(1.2)" : "none"
        },
        badge: {
            position: "absolute",
            top: "-8px",
            right: "-8px",
            backgroundColor: "#ff4444",
            color: "white",
            borderRadius: "50%",
            width: "20px",
            height: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "12px",
            fontWeight: "bold",
            boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
        }
    };

    return (
        <div style={styles.container}>
            <span
                style={styles.icon}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
            >
                🛒
            </span>
            {itemCount > 0 && (
                <span style={styles.badge}>
                    {itemCount}
                </span>
            )}
        </div>
    );
}
