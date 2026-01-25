import { Link, useNavigate } from 'react-router-dom'
import { useCartContext } from '../context/cartContext.jsx'
import { useUserContext } from '../context/userContext.jsx'
import { useNotification } from '../context/notificationContext.jsx'
import { useState } from 'react'
import ConfirmModal from './ConfirmModal.jsx'
import PurchaseModal from './PurchaseModal.jsx'
import { createBuyOrder } from '../data/dataService.js'

function Cart() {
    const navigate = useNavigate()
    const { showNotification } = useNotification()
    const {
        cart,
        removeItemFromCart,
        updateItemQuantity,
        clearCart,
        calculateTotalPrice,
        countItemsInCart
    } = useCartContext()

    const { user, availableCoins, spendCoins } = useUserContext()
    const [hoverItem, setHoverItem] = useState(null)
    const [showTooltip, setShowTooltip] = useState(null)
    const [modalConfig, setModalConfig] = useState({ isOpen: false, title: '', message: '', onConfirm: () => { } })
    const [showPurchaseModal, setShowPurchaseModal] = useState(false)

    const formatCategoryLabel = (cat) => {
        const map = { decoracion: 'Decoración', granero: 'Granero', silo: 'Silo', otros: 'Otros' }
        return map[cat] ?? (cat.charAt(0).toUpperCase() + cat.slice(1))
    }

    const styles = {
        container: {
            padding: '24px 20px',
            maxWidth: '1200px',
            margin: '0 auto'
        },
        header: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            flexWrap: 'wrap',
            gap: '12px'
        },
        title: {
            margin: 0,
            fontSize: '32px',
            fontWeight: 800,
            letterSpacing: '-0.3px'
        },
        clearButton: {
            padding: '10px 20px',
            backgroundColor: '#ff4444',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 8px rgba(255, 68, 68, 0.3)',
            fontFamily: 'Luckiest Guy, cursive'
        },
        clearButtonHover: {
            backgroundColor: '#cc0000',
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 12px rgba(255, 68, 68, 0.4)'
        },
        emptyCart: {
            textAlign: 'center',
            padding: '60px 20px',
            background: '#fff',
            borderRadius: '18px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
        },
        emptyIcon: {
            fontSize: '80px',
            marginBottom: '20px'
        },
        emptyText: {
            fontSize: '24px',
            color: '#666',
            marginBottom: '20px'
        },
        link: {
            textDecoration: 'none',
            color: '#1f7a1f',
            fontWeight: 600,
            fontSize: '18px',
            transition: 'color 0.2s ease'
        },
        cartList: {
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            overflow: 'visible'
        },
        cartItem: {
            display: 'grid',
            gridTemplateColumns: '120px 1fr auto',
            gap: '20px',
            background: '#fff',
            borderRadius: '16px',
            padding: '16px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            border: '2px solid transparent',
            transition: 'all 0.2s ease',
            overflow: 'visible',
            position: 'relative'
        },
        cartItemHover: {
            boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
            borderColor: '#2bbd2b'
        },
        itemImage: {
            width: '120px',
            height: '120px',
            objectFit: 'cover',
            borderRadius: '12px',
            background: '#f6f6f6'
        },
        itemInfo: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '8px'
        },
        itemTitle: {
            margin: 0,
            fontSize: '20px',
            fontWeight: 700,
            color: '#222'
        },
        itemCategory: {
            display: 'inline-block',
            background: '#2bbd2b',
            color: 'white',
            padding: '4px 12px',
            borderRadius: '12px',
            fontSize: '12px',
            textTransform: 'capitalize',
            width: 'fit-content'
        },
        itemPrice: {
            fontSize: '16px',
            color: '#666',
            margin: 0
        },
        itemActions: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            gap: '12px',
            overflow: 'visible'
        },
        quantityControl: {
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: '#f0f0f0',
            borderRadius: '8px',
            padding: '4px',
            position: 'relative',
            overflow: 'visible'
        },
        quantityButton: {
            width: '32px',
            height: '32px',
            border: 'none',
            background: '#2bbd2b',
            color: 'white',
            borderRadius: '6px',
            fontSize: '18px',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
        },
        tooltip: {
            position: 'absolute',
            bottom: '45px',
            right: '0',
            backgroundColor: '#ff4444',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '6px',
            fontSize: '11px',
            fontWeight: 600,
            whiteSpace: 'nowrap',
            boxShadow: '0 4px 12px rgba(255, 68, 68, 0.6)',
            zIndex: 99999
        },
        tooltipArrow: {
            position: 'absolute',
            bottom: '-5px',
            right: '8px',
            width: 0,
            height: 0,
            borderLeft: '6px solid transparent',
            borderRight: '6px solid transparent',
            borderTop: '6px solid #ff4444'
        },
        quantityValue: {
            minWidth: '40px',
            textAlign: 'center',
            fontSize: '16px',
            fontWeight: 700
        },
        subtotal: {
            fontSize: '20px',
            fontWeight: 800,
            color: '#222'
        },
        removeButton: {
            padding: '8px 16px',
            background: '#ff6b6b',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            fontFamily: 'Luckiest Guy, cursive'
        },
        summary: {
            marginTop: '30px',
            background: '#fff',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            border: '2px solid #2bbd2b'
        },
        summaryRow: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '12px',
            fontSize: '18px'
        },
        summaryTotal: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '16px',
            marginTop: '16px',
            borderTop: '2px solid #e0e0e0',
            fontSize: '28px',
            fontWeight: 800,
            color: '#2bbd2b'
        },
        checkoutButton: {
            width: '100%',
            marginTop: '20px',
            padding: '16px',
            background: '#2bbd2b',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '18px',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 12px rgba(43, 189, 43, 0.3)',
            fontFamily: 'Luckiest Guy, cursive'
        }
    }

    const handleClearCart = () => {
        setModalConfig({
            isOpen: true,
            title: '🗑️ Vaciar Carrito',
            message: '¿Estás seguro de que quieres eliminar todos los productos del carrito?',
            onConfirm: () => clearCart()
        })
    }

    const handleRemoveItem = (item) => {
        setModalConfig({
            isOpen: true,
            title: '🗑️ Eliminar Producto',
            message: `¿Estás seguro de que quieres eliminar "${item.title}" del carrito?`,
            onConfirm: () => removeItemFromCart(item.id)
        })
    }

    const closeModal = () => {
        setModalConfig({ isOpen: false, title: '', message: '', onConfirm: () => { } })
    }

    const handlePurchase = async () => {
        const total = calculateTotalPrice()

        // Crear objeto de orden
        const buyOrderData = {
            buyer: {
                name: `${user.firstName} ${user.lastName}`,
                farmAlias: user.farmAlias,
                userId: user.id
            },
            items: cart.map(item => ({
                id: item.id,
                title: item.title,
                category: item.category,
                price: item.price,
                quantity: item.count,
                img: item.img
            })),
            total: total
        }

        try {
            // Guardar orden en base de datos
            const orderId = await createBuyOrder(buyOrderData)
            console.log('Orden creada:', orderId)

            // Procesar compra
            spendCoins(total)
            clearCart()
            navigate('/')

            // Mostrar snackbar después de navegar
            setTimeout(() => {
                showNotification('¡Compra realizada con éxito! 🎉 Ingresa al juego para ver tus productos comprados', 5000)
            }, 100)
        } catch (error) {
            console.error('Error al crear orden:', error)
            showNotification('❌ Error al procesar la compra. Inténtalo de nuevo', 3000)
        }
    }

    const canIncreaseQuantity = (item) => {
        const newTotalCost = calculateTotalPrice() + item.price
        return newTotalCost <= availableCoins
    }

    const handleIncreaseQuantity = (item) => {
        if (!canIncreaseQuantity(item)) {
            alert(`No tienes suficientes monedas para agregar más de este producto. Te faltan 🪙 ${calculateTotalPrice() + item.price - availableCoins}`)
            return
        }
        updateItemQuantity(item.id, item.count + 1)
    }

    if (cart.length === 0) {
        return (
            <div style={styles.container}>
                <div style={styles.emptyCart}>
                    <div style={styles.emptyIcon}>🛒</div>
                    <h2 style={styles.emptyText}>Tu carrito está vacío</h2>
                    <Link to="/" style={styles.link}>
                        Ir a la tienda 🌾
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>🛒 Mi Carrito</h1>
                <button
                    style={styles.clearButton}
                    onClick={handleClearCart}
                    onMouseEnter={(e) => Object.assign(e.target.style, styles.clearButtonHover)}
                    onMouseLeave={(e) => Object.assign(e.target.style, { backgroundColor: '#ff4444', transform: 'translateY(0)', boxShadow: '0 2px 8px rgba(255, 68, 68, 0.3)' })}
                >
                    Vaciar Carrito
                </button>
            </div>

            <div style={styles.cartList}>
                {cart.map((item) => (
                    <div
                        key={item.id}
                        style={hoverItem === item.id ? { ...styles.cartItem, ...styles.cartItemHover } : styles.cartItem}
                        onMouseEnter={() => setHoverItem(item.id)}
                        onMouseLeave={() => setHoverItem(null)}
                    >
                        <img
                            src={item.img}
                            alt={item.title}
                            style={styles.itemImage}
                        />

                        <div style={styles.itemInfo}>
                            <div>
                                <h3 style={styles.itemTitle}>{item.title}</h3>
                                {item.category && (
                                    <span style={styles.itemCategory}>
                                        {formatCategoryLabel(item.category)}
                                    </span>
                                )}
                            </div>
                            <p style={styles.itemPrice}>🪙 {item.price} c/u</p>
                        </div>

                        <div style={styles.itemActions}>
                            <div style={styles.quantityControl}>
                                <button
                                    style={styles.quantityButton}
                                    onClick={() => updateItemQuantity(item.id, item.count - 1)}
                                    onMouseEnter={(e) => e.target.style.background = '#1f7a1f'}
                                    onMouseLeave={(e) => e.target.style.background = '#2bbd2b'}
                                >
                                    −
                                </button>
                                <span style={styles.quantityValue}>{item.count}</span>
                                <div
                                    style={{ position: 'relative' }}
                                    onMouseEnter={() => {
                                        if (!canIncreaseQuantity(item)) {
                                            setShowTooltip(item.id)
                                        }
                                    }}
                                    onMouseLeave={() => setShowTooltip(null)}
                                >
                                    <button
                                        style={{
                                            ...styles.quantityButton,
                                            background: !canIncreaseQuantity(item) ? '#d9d9d9' : '#2bbd2b',
                                            cursor: !canIncreaseQuantity(item) ? 'not-allowed' : 'pointer',
                                            opacity: !canIncreaseQuantity(item) ? 0.6 : 1
                                        }}
                                        onClick={() => handleIncreaseQuantity(item)}
                                        disabled={!canIncreaseQuantity(item)}
                                        onMouseEnter={(e) => {
                                            if (canIncreaseQuantity(item)) {
                                                e.target.style.background = '#1f7a1f'
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (canIncreaseQuantity(item)) {
                                                e.target.style.background = '#2bbd2b'
                                            } else {
                                                e.target.style.background = '#d9d9d9'
                                            }
                                        }}
                                    >
                                        +
                                    </button>
                                    {showTooltip === item.id && !canIncreaseQuantity(item) && (
                                        <div style={styles.tooltip}>
                                            ⚠️ No tienes monedas suficientes
                                            <div style={styles.tooltipArrow}></div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div style={styles.subtotal}>
                                🪙 {item.price * item.count}
                            </div>

                            <button
                                style={styles.removeButton}
                                onClick={() => handleRemoveItem(item)}
                                onMouseEnter={(e) => e.target.style.background = '#cc0000'}
                                onMouseLeave={(e) => e.target.style.background = '#ff6b6b'}
                            >
                                🗑️ Eliminar
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div style={styles.summary}>
                <div style={styles.summaryRow}>
                    <span>Total de productos:</span>
                    <span style={{ fontWeight: 700 }}>{cart.length}</span>
                </div>
                <div style={styles.summaryRow}>
                    <span>Total de unidades:</span>
                    <span style={{ fontWeight: 700 }}>{countItemsInCart()}</span>
                </div>
                <div style={styles.summaryRow}>
                    <span>Monedas disponibles:</span>
                    <span style={{ fontWeight: 700 }}>🪙 {availableCoins}</span>
                </div>
                <div style={styles.summaryTotal}>
                    <span>Total a pagar:</span>
                    <span>🪙 {calculateTotalPrice()}</span>
                </div>
                <div style={styles.summaryRow}>
                    <span>Saldo restante:</span>
                    <span style={{ fontWeight: 700, color: availableCoins - calculateTotalPrice() < 0 ? '#ff4444' : '#2bbd2b' }}>
                        🪙 {availableCoins - calculateTotalPrice()}
                    </span>
                </div>

                <button
                    style={{
                        ...styles.checkoutButton,
                        opacity: availableCoins - calculateTotalPrice() < 0 ? 0.5 : 1,
                        cursor: availableCoins - calculateTotalPrice() < 0 ? 'not-allowed' : 'pointer'
                    }}
                    disabled={availableCoins - calculateTotalPrice() < 0}
                    onClick={() => {
                        if (availableCoins - calculateTotalPrice() >= 0) {
                            setShowPurchaseModal(true)
                        }
                    }}
                    onMouseEnter={(e) => {
                        if (availableCoins - calculateTotalPrice() >= 0) {
                            e.target.style.background = '#1f7a1f'
                            e.target.style.transform = 'translateY(-2px)'
                            e.target.style.boxShadow = '0 6px 16px rgba(43, 189, 43, 0.4)'
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (availableCoins - calculateTotalPrice() >= 0) {
                            e.target.style.background = '#2bbd2b'
                            e.target.style.transform = 'translateY(0)'
                            e.target.style.boxShadow = '0 4px 12px rgba(43, 189, 43, 0.3)'
                        }
                    }}
                >
                    {availableCoins - calculateTotalPrice() < 0
                        ? '🚫 Monedas insuficientes'
                        : '🪙 Comprar ahora'}
                </button>
            </div>

            <ConfirmModal
                isOpen={modalConfig.isOpen}
                onClose={closeModal}
                onConfirm={modalConfig.onConfirm}
                title={modalConfig.title}
                message={modalConfig.message}
            />

            <PurchaseModal
                isOpen={showPurchaseModal}
                onClose={() => setShowPurchaseModal(false)}
                onConfirm={handlePurchase}
                totalPrice={calculateTotalPrice()}
                availableCoins={availableCoins}
                itemCount={countItemsInCart()}
            />
        </div >
    )
}

export default Cart
