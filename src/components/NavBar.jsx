import { NavLink, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import CartWidget from './CartWidget.jsx'
import { useUserContext } from '../context/userContext.jsx'

export default function NavBar() {
    const { user, availableCoins } = useUserContext()
    const [showAvatarTooltip, setShowAvatarTooltip] = useState(false)
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768)
        }

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const categories = ["decoracion", "granero", "silo", "otros"]

    const formatLabel = (cat) => {
        const map = { decoracion: 'Decoración', granero: 'Granero', silo: 'Silo', otros: 'Otros' }
        return map[cat] ?? (cat.charAt(0).toUpperCase() + cat.slice(1))
    }

    const styles = {
        nav: {
            backgroundColor: '#ffdf29ff',
            color: 'white',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: isMobile ? 'center' : 'space-between',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            flexWrap: 'wrap',
            gap: '12px'
        },
        titleContainer: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '12px',
            width: isMobile ? '100%' : 'auto',
            justifyContent: isMobile ? 'center' : 'flex-start'
        },
        titleContent: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '4px'
        },
        logo: {
            width: '65px',
            height: '65px',
            borderRadius: '50%',
            objectFit: 'cover',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
        },
        title: {
            margin: 0,
            fontSize: '24px',
            fontWeight: 'bold',
            fontFamily: 'Luckiest Guy, "Segoe UI Emoji", "Noto Color Emoji", sans-serif'
        },
        emojis: {
            fontSize: '18px',
            fontFamily: '"Segoe UI Emoji", "Noto Color Emoji", sans-serif'
        },
        links: {
            listStyle: 'none',
            display: 'flex',
            gap: '20px',
            margin: 0,
            padding: 0,
            flexWrap: 'wrap',
            justifyContent: 'center',
            flexGrow: 1
        },
        link: {
            textDecoration: 'none',
            color: 'white',
            fontSize: '18px'
        },
        linkHover: {
            color: '#2bbd2bff'
        },
        linkActive: {
            color: '#1f7a1f'
        },
        coinsContainer: {
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            width: isMobile ? '100%' : 'auto',
            justifyContent: isMobile ? 'center' : 'flex-start'
        },
        coinsBadge: {
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: '#fff',
            color: '#222',
            padding: '8px 14px',
            borderRadius: '999px',
            fontWeight: 700,
            fontSize: '16px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
            fontFamily: 'Luckiest Guy, "Segoe UI Emoji", "Noto Color Emoji", sans-serif'
        },
        avatar: {
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            objectFit: 'cover',
            border: '3px solid #fff',
            boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
            cursor: 'pointer',
            transition: 'transform 0.2s ease'
        },
        avatarContainer: {
            position: 'relative'
        },
        avatarTooltip: {
            position: 'absolute',
            bottom: '-35px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#222',
            color: '#fff',
            padding: '6px 12px',
            borderRadius: '8px',
            fontSize: '14px',
            whiteSpace: 'nowrap',
            zIndex: 99999,
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            fontFamily: 'Luckiest Guy, sans-serif',
            pointerEvents: 'none'
        }
    }

    const baseColor = styles.link.color
    const hoverColor = styles.linkHover.color
    const activeColor = styles.linkActive.color

    const navLinkStyle = (isActive) => ({
        ...styles.link,
        color: isActive ? activeColor : baseColor
    })

    return (
        <nav style={styles.nav}>
            <NavLink to="/" style={{ textDecoration: 'none' }}>
                {({ isActive }) => (
                    <div style={styles.titleContainer}>
                        <img
                            src="/wonder_farm_redondo.png"
                            alt="Wonder Farm Logo"
                            style={styles.logo}
                        />
                        <div style={styles.titleContent}>
                            <h2
                                style={{ ...styles.title, color: isActive ? activeColor : baseColor }}
                                onMouseEnter={(e) => { e.target.style.color = hoverColor }}
                                onMouseLeave={(e) => { e.target.style.color = isActive ? activeColor : baseColor }}
                            >
                                Wonder Farm
                            </h2>
                            <span style={{ ...styles.emojis, color: isActive ? activeColor : baseColor }}>
                                🐔 🐄 🐖 🐑 🐐
                            </span>
                        </div>
                    </div>
                )}
            </NavLink>

            <ul style={styles.links}>
                {categories.map((cat) => (
                    <li key={cat}>
                        <NavLink to={`/category/${cat}`} style={({ isActive }) => navLinkStyle(isActive)}>
                            {({ isActive }) => (
                                <span
                                    onMouseEnter={(e) => { e.target.style.color = hoverColor }}
                                    onMouseLeave={(e) => { e.target.style.color = isActive ? activeColor : baseColor }}
                                    style={{ color: isActive ? activeColor : baseColor, fontSize: styles.link.fontSize, textDecoration: 'none' }}
                                >
                                    {formatLabel(cat)}
                                </span>
                            )}
                        </NavLink>
                    </li>
                ))}
            </ul>

            <div style={styles.coinsContainer}>
                {user?.avatar && (
                    <div
                        style={styles.avatarContainer}
                        onMouseEnter={() => setShowAvatarTooltip(true)}
                        onMouseLeave={() => setShowAvatarTooltip(false)}
                    >
                        <img
                            src={user.avatar}
                            alt={`${user.firstName} ${user.lastName}`}
                            style={styles.avatar}
                        />
                        {showAvatarTooltip && (
                            <div style={styles.avatarTooltip}>
                                {user.firstName} {user.lastName}
                            </div>
                        )}
                    </div>
                )}
                <div style={styles.coinsBadge}>
                    <span>🪙</span>
                    <span>{availableCoins}</span>
                </div>
                <Link to="/cart" style={{ textDecoration: 'none' }}>
                    <CartWidget />
                </Link>
            </div>
        </nav>
    )
}
