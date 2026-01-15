import { useState } from 'react'

function PurchaseModal({ isOpen, onClose, onConfirm, totalPrice, availableCoins, itemCount }) {
    const [hover, setHover] = useState(null)

    if (!isOpen) return null

    const remainingCoins = availableCoins - totalPrice
    const canAfford = remainingCoins >= 0

    const styles = {
        overlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100000,
            animation: 'fadeIn 0.2s ease'
        },
        modal: {
            background: 'linear-gradient(135deg, #fff 0%, #fffef8 100%)',
            borderRadius: '20px',
            padding: '32px',
            maxWidth: '500px',
            width: '90%',
            boxShadow: '0 25px 70px rgba(0,0,0,0.4)',
            animation: 'slideUp 0.3s ease',
            border: '4px solid #ffdf29'
        },
        header: {
            textAlign: 'center',
            marginBottom: '24px'
        },
        icon: {
            fontSize: '64px',
            marginBottom: '16px'
        },
        title: {
            margin: '0 0 8px 0',
            fontSize: '28px',
            fontWeight: 800,
            color: '#222',
            fontFamily: 'Luckiest Guy, cursive'
        },
        subtitle: {
            margin: 0,
            fontSize: '14px',
            color: '#666'
        },
        divider: {
            height: '2px',
            background: 'linear-gradient(90deg, transparent, #ffdf29, transparent)',
            margin: '20px 0',
            border: 'none'
        },
        summary: {
            background: '#fff',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '20px',
            border: '2px solid #f0f0f0'
        },
        summaryRow: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '12px',
            fontSize: '16px'
        },
        summaryTotal: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '12px',
            marginTop: '12px',
            borderTop: '2px solid #e0e0e0',
            fontSize: '20px',
            fontWeight: 800
        },
        remaining: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px',
            background: canAfford ? '#e8f5e9' : '#ffebee',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '16px',
            fontWeight: 700,
            color: canAfford ? '#2bbd2b' : '#ff4444'
        },
        warning: {
            padding: '12px',
            background: '#fff3cd',
            border: '2px solid #ffc107',
            borderRadius: '8px',
            color: '#856404',
            fontSize: '14px',
            marginBottom: '20px',
            textAlign: 'center',
            fontWeight: 600
        },
        buttons: {
            display: 'flex',
            gap: '12px',
            justifyContent: 'space-between'
        },
        cancelButton: {
            flex: 1,
            padding: '14px 24px',
            border: '2px solid #ddd',
            background: 'transparent',
            color: '#666',
            borderRadius: '10px',
            fontSize: '16px',
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
            flex: 1,
            padding: '14px 24px',
            border: 'none',
            background: canAfford ? '#2bbd2b' : '#d9d9d9',
            color: canAfford ? 'white' : '#999',
            borderRadius: '10px',
            fontSize: '16px',
            fontWeight: 700,
            cursor: canAfford ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s ease',
            boxShadow: canAfford ? '0 4px 12px rgba(43, 189, 43, 0.3)' : 'none',
            opacity: canAfford ? 1 : 0.6,
            fontFamily: 'Luckiest Guy, cursive'
        },
        confirmButtonHover: {
            background: '#1f7a1f',
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 16px rgba(43, 189, 43, 0.4)'
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
                            transform: translateY(30px) scale(0.95);
                        }
                        to { 
                            opacity: 1;
                            transform: translateY(0) scale(1);
                        }
                    }
                `}
            </style>
            <div style={styles.overlay} onClick={handleOverlayClick}>
                <div style={styles.modal}>
                    <div style={styles.header}>
                        <div style={styles.icon}>🛒✨</div>
                        <h2 style={styles.title}>Confirmar Compra</h2>
                        <p style={styles.subtitle}>Wonder Farm Store</p>
                    </div>

                    <hr style={styles.divider} />

                    <div style={styles.summary}>
                        <div style={styles.summaryRow}>
                            <span>Productos en el carrito:</span>
                            <span style={{ fontWeight: 700 }}>{itemCount}</span>
                        </div>
                        <div style={styles.summaryRow}>
                            <span>Monedas disponibles:</span>
                            <span style={{ fontWeight: 700 }}>🪙 {availableCoins}</span>
                        </div>
                        <div style={styles.summaryTotal}>
                            <span>Total a pagar:</span>
                            <span style={{ color: '#2bbd2b' }}>🪙 {totalPrice}</span>
                        </div>
                    </div>

                    <div style={styles.remaining}>
                        <span>Saldo después de la compra:</span>
                        <span>🪙 {remainingCoins}</span>
                    </div>

                    {!canAfford && (
                        <div style={styles.warning}>
                            ⚠️ No tienes suficientes monedas para completar esta compra
                        </div>
                    )}

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
                            style={hover === 'confirm' && canAfford ? { ...styles.confirmButton, ...styles.confirmButtonHover } : styles.confirmButton}
                            disabled={!canAfford}
                            onClick={() => {
                                if (canAfford) {
                                    onConfirm()
                                    onClose()
                                }
                            }}
                            onMouseEnter={() => {
                                if (canAfford) setHover('confirm')
                            }}
                            onMouseLeave={() => setHover(null)}
                        >
                            {canAfford ? '🪙 Confirmar Compra' : '🚫 Insuficiente'}
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default PurchaseModal
