import { useParams, Link, useNavigate } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react'
import ItemCount from './ItemCount.jsx'
import { getItemData, createBuyOrder } from '../data/dataService.js'
import { useCartContext } from '../context/cartContext.jsx'
import { useUserContext } from '../context/userContext.jsx'
import { useNotification } from '../context/notificationContext.jsx'
import PurchaseModal from './PurchaseModal.jsx'

function ItemDetailContainer() {
    const { itemID } = useParams()
    const navigate = useNavigate()
    const { showNotification } = useNotification()
    const { addItemToCart, calculateTotalPrice } = useCartContext()
    const { user, availableCoins, spendCoins } = useUserContext()

    // Calcular monedas disponibles restando el total del carrito
    const cartTotal = calculateTotalPrice()
    const coinsAvailable = availableCoins - cartTotal
    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [hoverLink, setHoverLink] = useState(null)
    const [quantity, setQuantity] = useState(1)
    const [resetSignal, setResetSignal] = useState(0)
    const [addedMessage, setAddedMessage] = useState(null)
    const [showPurchaseModal, setShowPurchaseModal] = useState(false)
    const [purchaseQuantity, setPurchaseQuantity] = useState(1)
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 640)
    const addedTimeoutRef = useRef(null)

    const formatCategoryLabel = (cat) => {
        const map = { decoracion: 'Decoración', granero: 'Granero', silo: 'Silo', otros: 'Otros' }
        return map[cat] ?? (cat.charAt(0).toUpperCase() + cat.slice(1))
    }

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 640)
        }

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

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
            background: '#f6f6f6',
            aspectRatio: '1 / 1'
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
        },
        '@media (max-width: 768px)': {
            card: {
                gridTemplateColumns: '1fr',
                gap: '16px'
            },
            imageWrapper: {
                maxWidth: '300px',
                margin: '0 auto'
            }
        }
    }

    const handleAddToCart = (count) => {
        const totalCost = product.price * count

        if (totalCost > coinsAvailable) {
            setAddedMessage(`❌ No tienes suficientes monedas disponibles. Te faltan 🪙 ${totalCost - coinsAvailable}`)
            if (addedTimeoutRef.current) clearTimeout(addedTimeoutRef.current)
            addedTimeoutRef.current = setTimeout(() => setAddedMessage(null), 3200)
            return
        }

        addItemToCart(product, count)
        setQuantity(1)
        setResetSignal((s) => s + 1)
        setAddedMessage(`Se agregó ${count} al carrito`)
        if (addedTimeoutRef.current) clearTimeout(addedTimeoutRef.current)
        addedTimeoutRef.current = setTimeout(() => setAddedMessage(null), 3200)
    }

    const handleBuyNow = (count) => {
        const totalCost = product.price * count

        if (totalCost > availableCoins) {
            setAddedMessage(`❌ No tienes suficientes monedas disponibles. Te faltan 🪙 ${totalCost - availableCoins}`)
            if (addedTimeoutRef.current) clearTimeout(addedTimeoutRef.current)
            addedTimeoutRef.current = setTimeout(() => setAddedMessage(null), 3200)
            return
        }

        setPurchaseQuantity(count)
        setShowPurchaseModal(true)
    }

    const handleDirectPurchase = async () => {
        const totalCost = product.price * purchaseQuantity

        // Crear objeto de orden
        const buyOrderData = {
            buyer: {
                name: `${user.firstName} ${user.lastName}`,
                farmAlias: user.farmAlias,
                userId: user.id
            },
            items: [{
                id: product.id,
                title: product.title,
                category: product.category,
                price: product.price,
                quantity: purchaseQuantity,
                img: product.img
            }],
            total: totalCost
        }

        try {
            // Guardar orden en base de datos
            const orderId = await createBuyOrder(buyOrderData)
            console.log('Orden creada:', orderId)

            // Procesar compra
            spendCoins(totalCost)
            setQuantity(1)
            setResetSignal((s) => s + 1)
            navigate('/')

            setTimeout(() => {
                showNotification(`¡Compra exitosa! 🎉 Has adquirido ${purchaseQuantity} ${product.title}. Ingresa al juego para ver tu compra`, 5000)
            }, 100)
        } catch (error) {
            console.error('Error al crear orden:', error)
            showNotification('❌ Error al procesar la compra. Inténtalo de nuevo', 3000)
        }
    }

    useEffect(() => () => {
        if (addedTimeoutRef.current) clearTimeout(addedTimeoutRef.current)
    }, [])

    if (loading) {
        return (
            <section style={styles.section}>
                <style>
                    {`
                        .loading-animals {
                            white-space: nowrap;
                        }

                        @media (max-width: 360px) {
                            .loading-animals {
                                display: block;
                            }
                        }
                    `}
                </style>
                <div style={styles.message}>
                    Cargando producto...{' '}
                    <span className="loading-animals">🐔 🐄 🐖 🐑 🐐</span>
                </div>
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
            <style>
                {`
                    .loading-animals {
                        white-space: nowrap;
                    }

                    @media (max-width: 360px) {
                        .loading-animals {
                            display: block;
                        }
                    }
                `}
            </style>
            <h1 style={styles.heading}>Detalles del producto</h1>
            <div style={{
                ...styles.card,
                ...(isMobile && {
                    gridTemplateColumns: '1fr',
                    gap: '16px'
                })
            }}>
                <div style={{
                    ...styles.imageWrapper,
                    ...(isMobile && {
                        maxWidth: '180px',
                        margin: '0 auto'
                    })
                }}>
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
                        availableCoins={coinsAvailable}
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

            {/* Purchase Modal */}
            <PurchaseModal
                isOpen={showPurchaseModal}
                onClose={() => setShowPurchaseModal(false)}
                onConfirm={handleDirectPurchase}
                totalPrice={product.price * purchaseQuantity}
                availableCoins={user.coins}
                itemCount={purchaseQuantity}
            />
        </section>
    )
}

export default ItemDetailContainer