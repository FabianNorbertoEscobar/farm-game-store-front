import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useUserContext } from '../context/userContext.jsx'
import { getOrders } from '../data/dataService.js'

function OrderHistory() {
    const { user } = useUserContext()
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [expandedOrder, setExpandedOrder] = useState(null)

    useEffect(() => {
        let active = true

        const fetchOrders = async () => {
            try {
                setLoading(true)
                setError(null)
                const data = await getOrders(user.id)
                if (active) setOrders(data)
            } catch (err) {
                if (active) setError(err?.message || 'Error al cargar órdenes')
            } finally {
                if (active) setLoading(false)
            }
        }

        fetchOrders()

        return () => { active = false }
    }, [user.id])

    const formatDate = (date) => {
        if (!date) return 'Fecha no disponible'

        // Si es un Timestamp de Firestore
        if (date.toDate && typeof date.toDate === 'function') {
            date = date.toDate()
        }

        // Si es una fecha válida
        const d = new Date(date)
        if (isNaN(d.getTime())) return 'Fecha inválida'

        return d.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const formatCategoryLabel = (cat) => {
        const map = { decoracion: 'Decoración', granero: 'Granero', silo: 'Silo', otros: 'Otros' }
        return map[cat] ?? (cat.charAt(0).toUpperCase() + cat.slice(1))
    }

    const styles = {
        container: {
            padding: '24px 20px',
            maxWidth: '1200px',
            margin: '0 auto',
            minHeight: '80vh'
        },
        header: {
            marginBottom: '30px',
            textAlign: 'center'
        },
        titleContainer: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            marginBottom: '8px'
        },
        titleEmoji: {
            fontSize: '42px'
        },
        title: {
            margin: 0,
            fontSize: '42px',
            fontWeight: 800,
            letterSpacing: '-0.5px',
            background: 'linear-gradient(135deg, #2bbd2b 0%, #1f7a1f 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontFamily: 'Luckiest Guy, cursive'
        },
        subtitle: {
            margin: 0,
            fontSize: '16px',
            color: '#666'
        },
        backLink: {
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '20px',
            textDecoration: 'none',
            color: '#2bbd2b',
            fontSize: '16px',
            fontWeight: 600,
            transition: 'all 0.2s ease'
        },
        loadingContainer: {
            textAlign: 'center',
            padding: '60px 20px',
            fontSize: '20px',
            color: '#666'
        },
        errorContainer: {
            textAlign: 'center',
            padding: '60px 20px',
            background: '#fff',
            borderRadius: '18px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
        },
        errorIcon: {
            fontSize: '64px',
            marginBottom: '16px'
        },
        errorText: {
            fontSize: '20px',
            color: '#ff4444',
            marginBottom: '20px'
        },
        emptyContainer: {
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
        ordersList: {
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
        },
        orderCard: {
            background: '#fff',
            borderRadius: '18px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            border: '2px solid transparent'
        },
        orderCardHover: {
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            borderColor: '#2bbd2b',
            transform: 'translateY(-2px)'
        },
        orderHeader: {
            padding: '20px 24px',
            background: 'linear-gradient(135deg, #f8fff8 0%, #fff 100%)',
            borderBottom: '2px solid #f0f0f0',
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px'
        },
        orderHeaderLeft: {
            flex: '1',
            minWidth: '250px'
        },
        orderHeaderRight: {
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
        },
        orderId: {
            fontSize: '14px',
            color: '#999',
            marginBottom: '4px',
            fontFamily: 'monospace'
        },
        orderDate: {
            fontSize: '16px',
            color: '#666',
            fontWeight: 600
        },
        orderTotal: {
            fontSize: '24px',
            fontWeight: 800,
            color: '#2bbd2b'
        },
        expandIcon: {
            fontSize: '24px',
            transition: 'transform 0.3s ease',
            color: '#2bbd2b'
        },
        expandIconRotated: {
            transform: 'rotate(180deg)'
        },
        orderDetails: {
            padding: '24px',
            background: '#fff'
        },
        itemsList: {
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            marginBottom: '20px'
        },
        itemRow: {
            display: 'grid',
            gridTemplateColumns: '60px 1fr auto auto auto',
            gap: '16px',
            alignItems: 'center',
            padding: '12px',
            background: '#f9f9f9',
            borderRadius: '12px',
            border: '1px solid #e0e0e0'
        },
        itemImage: {
            width: '60px',
            height: '60px',
            objectFit: 'cover',
            borderRadius: '8px',
            border: '2px solid #e0e0e0'
        },
        itemInfo: {
            display: 'flex',
            flexDirection: 'column',
            gap: '4px'
        },
        itemTitle: {
            fontSize: '16px',
            fontWeight: 700,
            color: '#222',
            margin: 0
        },
        itemCategory: {
            fontSize: '13px',
            color: '#666',
            background: '#fff',
            padding: '2px 8px',
            borderRadius: '4px',
            display: 'inline-block',
            width: 'fit-content'
        },
        itemQuantity: {
            fontSize: '15px',
            fontWeight: 600,
            color: '#666'
        },
        itemPrice: {
            fontSize: '15px',
            fontWeight: 600,
            color: '#666',
            textAlign: 'right'
        },
        itemSubtotal: {
            fontSize: '18px',
            fontWeight: 800,
            color: '#2bbd2b',
            textAlign: 'right'
        },
        summaryBox: {
            background: 'linear-gradient(135deg, #f8fff8 0%, #fff 100%)',
            borderRadius: '12px',
            padding: '20px',
            border: '2px solid #2bbd2b'
        },
        summaryRow: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '8px',
            fontSize: '15px',
            color: '#666'
        },
        summaryTotal: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '12px',
            marginTop: '8px',
            borderTop: '2px solid #e0e0e0',
            fontSize: '22px',
            fontWeight: 800,
            color: '#222'
        },
        badge: {
            display: 'inline-block',
            padding: '4px 12px',
            background: '#2bbd2b',
            color: 'white',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: 700,
            textTransform: 'uppercase'
        }
    }

    if (loading) {
        return (
            <div style={styles.container}>
                <div style={styles.loadingContainer}>
                    Cargando historial... 📦 🚚 📋
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div style={styles.container}>
                <div style={styles.errorContainer}>
                    <div style={styles.errorIcon}>❌</div>
                    <div style={styles.errorText}>{error}</div>
                    <Link to="/" style={styles.backLink}>
                        ← Volver a la tienda
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div style={styles.container}>
            <Link to="/" style={styles.backLink}>
                ← Volver a la tienda
            </Link>

            <div style={styles.header}>
                <div style={styles.titleContainer}>
                    <span style={styles.titleEmoji}>📦</span>
                    <h1 style={styles.title}>Historial de Compras</h1>
                </div>
                <p style={styles.subtitle}>
                    {user.farmAlias} - {orders.length} {orders.length === 1 ? 'orden' : 'órdenes'}
                </p>
            </div>

            {orders.length === 0 ? (
                <div style={styles.emptyContainer}>
                    <div style={styles.emptyIcon}>📭</div>
                    <h2 style={styles.emptyText}>No tienes órdenes aún</h2>
                    <Link to="/" style={styles.backLink}>
                        Explorar productos 🌾
                    </Link>
                </div>
            ) : (
                <div style={styles.ordersList}>
                    {orders.map((order) => {
                        const isExpanded = expandedOrder === order.id

                        return (
                            <div
                                key={order.id}
                                style={isExpanded ? { ...styles.orderCard, ...styles.orderCardHover } : styles.orderCard}
                            >
                                <div
                                    style={styles.orderHeader}
                                    onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                                >
                                    <div style={styles.orderHeaderLeft}>
                                        <div style={styles.orderId}>ID: {order.id}</div>
                                        <div style={styles.orderDate}>
                                            📅 {formatDate(order.createdAt)}
                                        </div>
                                    </div>
                                    <div style={styles.orderHeaderRight}>
                                        <div style={styles.badge}>
                                            {order.items.length} {order.items.length === 1 ? 'producto' : 'productos'}
                                        </div>
                                        <div style={styles.orderTotal}>
                                            🪙 {order.total}
                                        </div>
                                        <div
                                            style={isExpanded
                                                ? { ...styles.expandIcon, ...styles.expandIconRotated }
                                                : styles.expandIcon
                                            }
                                        >
                                            ▼
                                        </div>
                                    </div>
                                </div>

                                {isExpanded && (
                                    <div style={styles.orderDetails}>
                                        <div style={styles.itemsList}>
                                            {order.items.map((item, index) => (
                                                <div key={index} style={styles.itemRow}>
                                                    <img
                                                        src={item.img}
                                                        alt={item.title}
                                                        style={styles.itemImage}
                                                    />
                                                    <div style={styles.itemInfo}>
                                                        <h3 style={styles.itemTitle}>{item.title}</h3>
                                                        <span style={styles.itemCategory}>
                                                            {formatCategoryLabel(item.category)}
                                                        </span>
                                                    </div>
                                                    <div style={styles.itemPrice}>
                                                        🪙 {item.price}
                                                        <div style={{ fontSize: '12px', color: '#999', marginTop: '2px' }}>
                                                            c/u
                                                        </div>
                                                    </div>
                                                    <div style={styles.itemQuantity}>
                                                        x{item.quantity}
                                                    </div>
                                                    <div style={styles.itemSubtotal}>
                                                        🪙 {item.price * item.quantity}
                                                        <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>
                                                            subtotal
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div style={styles.summaryBox}>
                                            <div style={styles.summaryRow}>
                                                <span>Total de productos:</span>
                                                <span style={{ fontWeight: 600 }}>{order.items.reduce((sum, item) => sum + item.quantity, 0)} unidades</span>
                                            </div>
                                            <div style={styles.summaryTotal}>
                                                <span>Total pagado:</span>
                                                <span style={{ color: '#2bbd2b' }}>🪙 {order.total}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

export default OrderHistory
