import { useState } from "react"
import { Link } from "react-router-dom"

export default function Item({ title, img, price, id, category }) {
    const [hover, setHover] = useState(false)
    const animationDelay = `${Math.random() * 5}s`

    const categoryDisplay = {
        decoracion: 'Decoración',
        granero: 'Granero',
        silo: 'Silo',
        otros: 'Otros'
    }[category] || category

    const styles = {
        card: {
            display: 'grid',
            gridTemplateColumns: '160px 1fr',
            gap: '16px',
            alignItems: 'stretch',
            background: '#ffffff',
            borderRadius: '16px',
            boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
            padding: '16px',
            width: '100%',
            boxSizing: 'border-box',
            border: '1px solid rgba(0,0,0,0.06)',
            animation: `card-glow 6s ease-in-out infinite`,
            animationDelay: animationDelay,
            position: 'relative',
            cursor: 'pointer'
        },
        imageWrapper: {
            position: 'relative',
            borderRadius: '12px',
            overflow: 'hidden',
            background: '#f7f7f7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        },
        image: {
            width: '100%',
            height: '100%',
            objectFit: 'cover'
        },
        badge: {
            position: 'absolute',
            top: '10px',
            left: '10px',
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
            justifyContent: 'space-between',
            minWidth: 0
        },
        title: {
            margin: '0 0 8px 0',
            fontSize: '20px',
            lineHeight: 1.2,
            wordBreak: 'break-word',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical'
        },
        price: {
            margin: '0 0 16px 0',
            fontWeight: 700,
            fontSize: '26px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
        },
        coin: {
            fontSize: '28px',
            filter: 'hue-rotate(-50deg) saturate(1.8) brightness(1.2)',
            textShadow: '0 0 10px rgba(255,200,0,0.9)'
        },
        button: {
            display: 'inline-block',
            textDecoration: 'none',
            background: '#ffdf29',
            color: '#222',
            fontWeight: 600,
            padding: '10px 14px',
            borderRadius: '10px',
            boxShadow: '0 6px 12px rgba(255,223,41,0.35)',
            transition: 'transform .1s ease, box-shadow .2s ease, background .2s ease',
            width: 'fit-content',
            maxWidth: '100%',
            transform: 'translateY(0)'
        }
    }

    const buttonStyle = hover
        ? {
            ...styles.button,
            background: '#f1c40f',
            boxShadow: '0 8px 16px rgba(241,196,15,0.45)',
            transform: 'translateY(-2px)'
        }
        : styles.button

    return (
        <div className="item-card" style={styles.card} title={title}>
            <div style={styles.imageWrapper}>
                <img style={styles.image} src={img} alt={title} />
                {category && (
                    <span style={styles.badge}>{categoryDisplay}</span>
                )}
            </div>
            <div className="item-card-content" style={styles.content}>
                <h3 className="item-card-title" style={styles.title}>{title}</h3>
                <p className="item-card-price" style={styles.price}>
                    <span style={styles.coin}>🪙</span>
                    {price}
                </p>
                <Link
                    className="item-card-button"
                    style={buttonStyle}
                    to={`/product/${id}`}
                    onMouseEnter={() => setHover(true)}
                    onMouseLeave={() => setHover(false)}
                >
                    Ver producto
                </Link>
            </div>
        </div>
    )
}