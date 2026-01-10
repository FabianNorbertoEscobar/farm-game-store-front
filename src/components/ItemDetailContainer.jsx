import { useParams, Link } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react'
import ItemCount from './ItemCount.jsx'
import { getItemData } from '../data/mockService.js'

function ItemDetailContainer() {
    const { itemID } = useParams()
    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [hoverLink, setHoverLink] = useState(null)
    const [quantity, setQuantity] = useState(1)
    const [resetSignal, setResetSignal] = useState(0)
    const [addedMessage, setAddedMessage] = useState(null)
    const addedTimeoutRef = useRef(null)

    const formatCategoryLabel = (cat) => {
        const map = { decoracion: 'Decoración', granero: 'Granero', silo: 'Silo', otros: 'Otros' }
        return map[cat] ?? (cat.charAt(0).toUpperCase() + cat.slice(1))
    }

    useEffect(() => {
        let active = true
        queueMicrotask(() => {
            if (!active) return
            setLoading(true)
            setError(null)
            setProduct(null)
        })

        getItemData(itemID)
            .then((data) => {
                if (active) setProduct(data)
            })
            .catch((err) => {
                if (active) setError(err?.message || 'Error al cargar producto')
            })
            .finally(() => {
                if (active) setLoading(false)
            })

        return () => { active = false }
    }, [itemID])

    const styles = {
        section: {
            padding: '24px 20px',
            maxWidth: '960px',
            margin: '0 auto'
        },
        heading: {
            margin: '0 0 14px 0',
            fontSize: '28px',
            fontWeight: 800,
            letterSpacing: '-0.2px'
        },
        card: {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px',
            background: '#fff',
            borderRadius: '18px',
            boxShadow: '0 10px 24px rgba(0,0,0,0.12)',
            padding: '20px',
            border: '1px solid rgba(0,0,0,0.05)'
        },
        imageWrapper: {
            position: 'relative',
            borderRadius: '14px',
            overflow: 'hidden',
            background: '#f6f6f6'
        },
        image: {
            width: '100%',
            height: '100%',
            objectFit: 'cover'
        },
        badge: {
            position: 'absolute',
            top: '12px',
            left: '12px',
            background: '#2bbd2b',
            color: '#fff',
            fontSize: '12px',
            padding: '6px 10px',
            borderRadius: '999px',
            textTransform: 'capitalize',
            boxShadow: '0 4px 10px rgba(0,0,0,0.15)'
        },
        content: {
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
        },
        title: {
            margin: 0,
            fontSize: '26px'
        },
        price: {
            margin: 0,
            fontSize: '18px',
            fontWeight: 600,
            color: '#666'
        },
        totalPrice: {
            margin: 0,
            fontSize: '28px',
            fontWeight: 800,
            color: '#222'
        },
        actions: {
            display: 'flex',
            gap: '10px',
            marginTop: '8px',
            alignItems: 'center',
            flexWrap: 'wrap'
        },
        link: {
            textDecoration: 'none',
            color: '#1f7a1f',
            fontWeight: 600,
            transition: 'color .2s ease, text-decoration .2s ease'
        },
        linkHover: {
            color: '#2bbd2b',
            textDecoration: 'underline'
        },
        message: {
            padding: '16px',
            background: '#fff8d6',
            borderRadius: '12px',
            border: '1px solid rgba(0,0,0,0.05)',
            textAlign: 'center',
            fontFamily: 'Luckiest Guy, "Segoe UI Emoji", "Noto Color Emoji", sans-serif'
        },
        added: {
            marginTop: '6px',
            color: '#1f7a1f',
            fontWeight: 800,
            animation: 'blink-added 0.7s ease-in-out infinite alternate'
        }
    }

    const handleAddToCart = (count) => {
        setQuantity(1)
        setResetSignal((s) => s + 1)
        setAddedMessage(`Se agregó ${count} al carrito`)
        if (addedTimeoutRef.current) clearTimeout(addedTimeoutRef.current)
        addedTimeoutRef.current = setTimeout(() => setAddedMessage(null), 3200)
    }

    const handleBuyNow = (count) => {
        setQuantity(1)
        setResetSignal((s) => s + 1)
        setAddedMessage(`Compra exitosa de ${count}`)
        if (addedTimeoutRef.current) clearTimeout(addedTimeoutRef.current)
        addedTimeoutRef.current = setTimeout(() => setAddedMessage(null), 3200)
    }

    useEffect(() => () => {
        if (addedTimeoutRef.current) clearTimeout(addedTimeoutRef.current)
    }, [])

    if (loading) {
        return (
            <section style={styles.section}>
                <div style={styles.message}>Cargando producto... 🐔 🐄 🐖 🐑 🐐</div>
            </section>
        )
    }

    if (error || !product) {
        return (
            <section style={styles.section}>
                <div style={styles.message}>
                    {error || 'Producto no encontrado'}
                    <div style={{ marginTop: '8px' }}>
                        <Link to="/" style={styles.link}>Volver al inicio</Link>
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section style={styles.section}>
            <h1 style={styles.heading}>Detalles del producto</h1>
            <div style={styles.card}>
                <div style={styles.imageWrapper}>
                    <img style={styles.image} src={product.img} alt={product.title} />
                    {product.category && <span style={styles.badge}>{formatCategoryLabel(product.category)}</span>}
                </div>

                <div style={styles.content}>
                    <h2 style={styles.title}>{product.title}</h2>
                    <p style={styles.price}>🪙 {product.price} c/u</p>
                    <p style={styles.totalPrice}>🪙 {product.price * quantity} total</p>
                    <ItemCount
                        min={1}
                        max={999}
                        initial={1}
                        onChange={setQuantity}
                        onAdd={handleAddToCart}
                        onBuy={handleBuyNow}
                        unitPrice={product.price}
                        availableCoins={12526}
                        resetSignal={resetSignal}
                    />
                    {addedMessage && <div style={styles.added}>{addedMessage}</div>}

                    <div style={styles.actions}>
                        <Link
                            to="/"
                            style={hoverLink === 'inicio' ? { ...styles.link, ...styles.linkHover } : styles.link}
                            onMouseEnter={() => setHoverLink('inicio')}
                            onMouseLeave={() => setHoverLink(null)}
                        >
                            Inicio
                        </Link>
                        {product.category && (
                            <Link
                                to={`/category/${product.category}`}
                                style={hoverLink === 'category' ? { ...styles.link, ...styles.linkHover } : styles.link}
                                onMouseEnter={() => setHoverLink('category')}
                                onMouseLeave={() => setHoverLink(null)}
                            >
                                Ver más en {formatCategoryLabel(product.category)}
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ItemDetailContainer