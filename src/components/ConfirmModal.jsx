import { useState } from 'react'

function ConfirmModal({ isOpen, onClose, onConfirm, title, message }) {
    const [hover, setHover] = useState(null)

    if (!isOpen) return null

    const styles = {
        overlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100000,
            animation: 'fadeIn 0.2s ease'
        },
        modal: {
            background: '#fff',
            borderRadius: '16px',
            padding: '28px',
            maxWidth: '450px',
            width: '90%',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            animation: 'slideUp 0.3s ease',
            border: '3px solid #ffdf29'
        },
        title: {
            margin: '0 0 16px 0',
            fontSize: '24px',
            fontWeight: 800,
            color: '#222',
            fontFamily: 'Luckiest Guy, cursive'
        },
        message: {
            margin: '0 0 24px 0',
            fontSize: '16px',
            color: '#666',
            lineHeight: '1.5'
        },
        buttons: {
            display: 'flex',
            gap: '12px',
            justifyContent: 'flex-end'
        },
        cancelButton: {
            padding: '12px 24px',
            border: '2px solid #ddd',
            background: 'transparent',
            color: '#666',
            borderRadius: '8px',
            fontSize: '15px',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            fontFamily: 'Luckiest Guy, cursive'
        },
        cancelButtonHover: {
            background: '#f5f5f5',
            borderColor: '#bbb',
            transform: 'translateY(-1px)'
        },
        confirmButton: {
            padding: '12px 24px',
            border: 'none',
            background: '#ff4444',
            color: 'white',
            borderRadius: '8px',
            fontSize: '15px',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 12px rgba(255, 68, 68, 0.3)',
            fontFamily: 'Luckiest Guy, cursive'
        },
        confirmButtonHover: {
            background: '#cc0000',
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 16px rgba(255, 68, 68, 0.4)'
        }
    }

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose()
        }
    }

    return (
        <>
            <style>
                {`
                    @keyframes fadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                    @keyframes slideUp {
                        from {
                            opacity: 0;
                            transform: translateY(20px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                `}
            </style>
            <div style={styles.overlay} onClick={handleOverlayClick}>
                <div style={styles.modal}>
                    <h2 style={styles.title}>{title}</h2>
                    <p style={styles.message}>{message}</p>
                    <div style={styles.buttons}>
                        <button
                            style={hover === 'cancel' ? { ...styles.cancelButton, ...styles.cancelButtonHover } : styles.cancelButton}
                            onClick={onClose}
                            onMouseEnter={() => setHover('cancel')}
                            onMouseLeave={() => setHover(null)}
                        >
                            Cancelar
                        </button>
                        <button
                            style={hover === 'confirm' ? { ...styles.confirmButton, ...styles.confirmButtonHover } : styles.confirmButton}
                            onClick={() => {
                                onConfirm()
                                onClose()
                            }}
                            onMouseEnter={() => setHover('confirm')}
                            onMouseLeave={() => setHover(null)}
                        >
                            Confirmar
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ConfirmModal
