import { useEffect, useMemo } from 'react'

function Snackbar({ message, isVisible, onClose, duration = 4000 }) {
    const flyingEmojis = useMemo(() => {
        if (!isVisible) return []

        // Generar emojis voladores
        const emojis = ['🐔', '🐄', '🐖', '🐑', '🐐']
        const generated = []
        for (let i = 0; i < 8; i++) {
            generated.push({
                id: i,
                emoji: emojis[Math.floor(Math.random() * emojis.length)],
                left: Math.random() * 80 + 10, // Entre 10% y 90%
                delay: Math.random() * 0.3, // Delay entre 0 y 0.3s
                duration: 2 + Math.random() * 1 // Duración entre 2 y 3s
            })
        }
        return generated
    }, [isVisible])

    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onClose()
            }, duration)

            return () => clearTimeout(timer)
        }
    }, [isVisible, duration, onClose])

    if (!isVisible) return null

    const styles = {
        snackbar: {
            position: 'fixed',
            bottom: '30px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'linear-gradient(135deg, #2bbd2b 0%, #1f7a1f 100%)',
            color: 'white',
            padding: '16px 28px',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(43, 189, 43, 0.4)',
            zIndex: 999999,
            animation: 'slideUpSnackbar 0.4s ease, fadeOut 0.3s ease ' + (duration - 300) + 'ms forwards',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            maxWidth: '500px',
            border: '2px solid #ffdf29',
            fontFamily: 'Luckiest Guy, cursive',
            fontSize: '16px',
            letterSpacing: '0.5px'
        },
        icon: {
            fontSize: '24px'
        },
        flyingEmoji: {
            position: 'fixed',
            fontSize: '32px',
            bottom: '30px',
            pointerEvents: 'none',
            zIndex: 999998
        }
    }

    return (
        <>
            <style>
                {`
                    @keyframes slideUpSnackbar {
                        from {
                            opacity: 0;
                            transform: translateX(-50%) translateY(100px);
                        }
                        to {
                            opacity: 1;
                            transform: translateX(-50%) translateY(0);
                        }
                    }
                    @keyframes fadeOut {
                        from {
                            opacity: 1;
                        }
                        to {
                            opacity: 0;
                        }
                    }
                    @keyframes flyUp {
                        0% {
                            opacity: 1;
                            transform: translateY(0) rotate(0deg) scale(1);
                        }
                        50% {
                            opacity: 0.8;
                            transform: translateY(-200px) rotate(180deg) scale(1.2);
                        }
                        100% {
                            opacity: 0;
                            transform: translateY(-400px) rotate(360deg) scale(0.5);
                        }
                    }
                `}
            </style>

            {/* Emojis voladores */}
            {flyingEmojis.map((item) => (
                <div
                    key={item.id}
                    style={{
                        ...styles.flyingEmoji,
                        left: `${item.left}%`,
                        animation: `flyUp ${item.duration}s ease-out ${item.delay}s forwards`
                    }}
                >
                    {item.emoji}
                </div>
            ))}

            <div style={styles.snackbar}>
                <span style={styles.icon}>✅</span>
                <span>{message}</span>
            </div>
        </>
    )
}

export default Snackbar
