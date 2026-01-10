import { useState, useRef, useEffect } from "react"

export default function ItemCount({ initial = 1, min = 1, max = 999, onAdd, onBuy, onChange, unitPrice = 0, availableCoins = Infinity, resetSignal = 0 }) {
    const computeEffectiveMax = () => {
        if (unitPrice <= 0) return max
        const maxAffordableLocal = Math.floor(availableCoins / unitPrice)
        return Math.min(max, maxAffordableLocal)
    }

    const [count, setCount] = useState(() => Math.max(min, Math.min(initial, computeEffectiveMax() || min)))
    const holdIntervalRef = useRef(null)
    const holdTimeoutRef = useRef(null)

    const effectiveMax = computeEffectiveMax()
    const canAffordMore = unitPrice <= 0 ? true : (count + 1) * unitPrice <= availableCoins && count < effectiveMax
    const showFundsWarning = unitPrice > 0 && availableCoins !== Infinity && count >= effectiveMax && !canAffordMore
    const canBuyProduct = unitPrice <= 0 || availableCoins >= unitPrice
    const insufficientFundsMessage = !canBuyProduct ? `No tienes monedas suficientes para comprar este producto. Necesitas ${unitPrice} monedas.` : null

    useEffect(() => {
        if (typeof onChange === "function") onChange(count)
    }, [count])

    useEffect(() => {
        setCount(Math.max(min, Math.min(initial, computeEffectiveMax() || min)))
    }, [resetSignal])

    const clearHolds = () => {
        if (holdIntervalRef.current) {
            clearInterval(holdIntervalRef.current)
            holdIntervalRef.current = null
        }
        if (holdTimeoutRef.current) {
            clearTimeout(holdTimeoutRef.current)
            holdTimeoutRef.current = null
        }
    }

    const handleResta = () => setCount(c => {
        const next = Math.max(min, c - 1)
        if (next === c) clearHolds()
        return next
    })

    const handleSuma = () => setCount(c => {
        const next = Math.min(effectiveMax, c + 1)
        if (next === c) clearHolds()
        return next
    })

    const handleAdd = () => { if (typeof onAdd === "function") onAdd(count) }
    const handleBuy = () => { if (typeof onBuy === "function") onBuy(count) }

    const startHold = (action, canStart) => {
        if (!canStart) return
        clearHolds()
        holdTimeoutRef.current = setTimeout(() => {
            holdIntervalRef.current = setInterval(action, 80)
        }, 300)
    }

    useEffect(() => () => clearHolds(), [])

    const [hoverCircle, setHoverCircle] = useState(null)
    const [hoverAdd, setHoverAdd] = useState(false)
    const [hoverBuy, setHoverBuy] = useState(false)

    const styles = {
        wrapper: {
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            background: '#fff8d6',
            borderRadius: '12px',
            padding: '12px',
            border: '1px solid rgba(0,0,0,0.05)',
            boxShadow: '0 6px 14px rgba(255,223,41,0.25)'
        },
        controls: {
            display: 'grid',
            gridTemplateColumns: '40px 1fr 40px',
            alignItems: 'center',
            gap: '8px'
        },
        buttonCircle: (disabled, isHovered, isInsufficientFunds = false) => ({
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            border: 'none',
            background: disabled ? (isInsufficientFunds ? '#ff4444' : '#d9d9d9') : isHovered ? '#ffc107' : '#ffdf29',
            color: disabled && isInsufficientFunds ? '#fff' : '#222',
            fontWeight: 700,
            fontSize: '18px',
            cursor: disabled ? 'not-allowed' : 'pointer',
            boxShadow: disabled ? (isInsufficientFunds ? '0 4px 10px rgba(255,68,68,0.4)' : 'none') : isHovered ? '0 8px 16px rgba(255,193,7,0.5)' : '0 6px 12px rgba(255,223,41,0.35)',
            transition: 'transform .1s ease, box-shadow .2s ease, background .2s ease',
            transform: isHovered && !disabled ? 'scale(1.05)' : 'scale(1)'
        }),
        count: {
            textAlign: 'center',
            fontSize: '18px',
            fontWeight: 700,
            padding: '10px 0',
            background: '#fff',
            borderRadius: '10px',
            border: '1px solid rgba(0,0,0,0.05)',
            boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.06)'
        },
        addButton: {
            width: '100%',
            border: 'none',
            borderRadius: '10px',
            background: !canBuyProduct ? '#d9d9d9' : hoverAdd ? '#f39c12' : '#f1c40f',
            color: !canBuyProduct ? '#999' : '#222',
            fontWeight: 700,
            fontFamily: 'Luckiest Guy, cursive',
            padding: '12px 14px',
            cursor: !canBuyProduct ? 'not-allowed' : 'pointer',
            boxShadow: !canBuyProduct ? 'none' : hoverAdd ? '0 10px 20px rgba(243,156,18,0.35)' : '0 8px 16px rgba(241,196,15,0.35)',
            transition: 'transform .1s ease, box-shadow .2s ease, background .2s ease',
            transform: hoverAdd && !canBuyProduct === false ? 'translateY(-2px)' : undefined,
            animation: !canBuyProduct ? 'none' : 'pulse-button 3s ease-in-out infinite',
            animationPlayState: hoverAdd || !canBuyProduct ? 'paused' : 'running',
            willChange: 'transform, box-shadow, filter',
            opacity: !canBuyProduct ? 0.6 : 1
        },
        buyNowButton: {
            width: '100%',
            border: 'none',
            borderRadius: '10px',
            background: !canBuyProduct ? '#d9d9d9' : hoverBuy ? '#229722' : '#2bbd2b',
            color: !canBuyProduct ? '#999' : '#fff',
            fontWeight: 800,
            fontFamily: 'Luckiest Guy, cursive',
            padding: '12px 14px',
            cursor: !canBuyProduct ? 'not-allowed' : 'pointer',
            boxShadow: !canBuyProduct ? 'none' : hoverBuy ? '0 10px 20px rgba(34,151,34,0.45)' : '0 8px 16px rgba(43,189,43,0.35)',
            transition: 'transform .1s ease, box-shadow .2s ease, background .2s ease',
            transform: hoverBuy && !canBuyProduct === false ? 'translateY(-2px)' : undefined,
            animation: !canBuyProduct ? 'none' : 'pulse-button-primary 3s ease-in-out infinite',
            animationPlayState: hoverBuy || !canBuyProduct ? 'paused' : 'running',
            willChange: 'transform, box-shadow, filter',
            opacity: !canBuyProduct ? 0.6 : 1
        },
        warning: {
            color: '#d32f2f',
            fontWeight: 700,
            textAlign: 'center'
        }
    }

    return (
        <div style={styles.wrapper}>
            <div style={styles.controls}>
                <button
                    onClick={handleResta}
                    onMouseDown={() => startHold(handleResta, count > min)}
                    onMouseUp={clearHolds}
                    onMouseLeave={() => { clearHolds(); setHoverCircle(null) }}
                    disabled={count <= min}
                    style={styles.buttonCircle(count <= min, hoverCircle === 'resta')}
                    onMouseEnter={() => setHoverCircle('resta')}
                >
                    -
                </button>
                <span style={styles.count}>{count}</span>
                <button
                    onClick={handleSuma}
                    onMouseDown={() => startHold(handleSuma, count < effectiveMax)}
                    onMouseUp={clearHolds}
                    onMouseLeave={() => { clearHolds(); setHoverCircle(null) }}
                    disabled={count >= effectiveMax}
                    style={styles.buttonCircle(count >= effectiveMax, hoverCircle === 'suma', !canAffordMore)}
                    onMouseEnter={() => setHoverCircle('suma')}
                >
                    +
                </button>
            </div>
            <button
                onClick={handleAdd}
                style={styles.addButton}
                onMouseEnter={() => setHoverAdd(true)}
                onMouseLeave={() => setHoverAdd(false)}
                disabled={!canBuyProduct}
            >
                🛒 Agregar al carrito
            </button>
            <button
                onClick={handleBuy}
                style={styles.buyNowButton}
                onMouseEnter={() => setHoverBuy(true)}
                onMouseLeave={() => setHoverBuy(false)}
                disabled={!canBuyProduct}
            >
                ⚡ Comprar ahora
            </button>
            {insufficientFundsMessage && (
                <div style={styles.warning}>{insufficientFundsMessage}</div>
            )}
            {!insufficientFundsMessage && showFundsWarning && (
                <div style={styles.warning}>No tienes monedas suficientes para agregar más.</div>
            )}
        </div>
    )
}