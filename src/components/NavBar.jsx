import { NavLink, Link } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import CartWidget from './CartWidget.jsx'
import { useUserContext } from '../context/userContext.jsx'

export default function NavBar() {
    const { user, availableCoins, updateCoins } = useUserContext()
    const [showAvatarTooltip, setShowAvatarTooltip] = useState(false)
    const [showUserMenu, setShowUserMenu] = useState(false)
    const [showCoinsMenu, setShowCoinsMenu] = useState(false)
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
    const menuRef = useRef(null)
    const coinsMenuRef = useRef(null)

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768)
        }

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowUserMenu(false)
            }
            if (coinsMenuRef.current && !coinsMenuRef.current.contains(event.target)) {
                setShowCoinsMenu(false)
            }
        }

        if (showUserMenu || showCoinsMenu) {
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [showUserMenu, showCoinsMenu])

    const categories = ["decoracion", "granero", "silo", "otros"]

    const formatLabel = (cat) => {
        const map = { decoracion: 'Decoración', granero: 'Granero', silo: 'Silo', otros: 'Otros' }
        return map[cat] ?? (cat.charAt(0).toUpperCase() + cat.slice(1))
    }

    const handleUpdateCoins = () => {
        // Simular obtención de monedas ganadas en el juego
        const coinsEarned = Math.floor(Math.random() * 500) + 100 // Entre 100 y 600 monedas
        const newTotal = availableCoins + coinsEarned
        updateCoins(newTotal)
        setShowCoinsMenu(false)

        // Mostrar feedback visual (opcional)
        console.log(`¡Has ganado ${coinsEarned} monedas en el juego! 🎮`)
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
            justifyContent: isMobile ? 'center' : 'flex-start',
            position: 'relative'
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
            fontFamily: 'Luckiest Guy, "Segoe UI Emoji", "Noto Color Emoji", sans-serif',
            cursor: 'pointer',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease'
        },
        coinsBadgeHover: {
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 16px rgba(0,0,0,0.2)'
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
        },
        userMenu: {
            position: 'absolute',
            top: '58px',
            right: '0',
            backgroundColor: '#fff',
            borderRadius: '12px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            border: '2px solid #ffdf29',
            minWidth: '200px',
            overflow: 'hidden',
            zIndex: 99999,
            animation: 'slideDown 0.2s ease'
        },
        menuItem: {
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            textDecoration: 'none',
            color: '#222',
            fontSize: '16px',
            fontWeight: 600,
            transition: 'all 0.2s ease',
            cursor: 'pointer',
            borderBottom: '1px solid #f0f0f0'
        },
        menuItemHover: {
            backgroundColor: '#f8fff8',
            color: '#2bbd2b'
        },
        menuIcon: {
            fontSize: '20px',
            width: '24px',
            textAlign: 'center'
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
        <>
            <style>
                {`
                    @keyframes slideDown {
                        from {
                            opacity: 0;
                            transform: translateY(-10px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                `}
            </style>
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
                            ref={menuRef}
                            style={styles.avatarContainer}
                            onMouseEnter={() => setShowAvatarTooltip(true)}
                            onMouseLeave={() => setShowAvatarTooltip(false)}
                        >
                            <img
                                src={user.avatar}
                                alt={`${user.firstName} ${user.lastName}`}
                                style={styles.avatar}
                                onClick={() => setShowUserMenu(!showUserMenu)}
                            />
                            {showAvatarTooltip && !showUserMenu && (
                                <div style={styles.avatarTooltip}>
                                    {user.firstName} {user.lastName}
                                </div>
                            )}

                            {showUserMenu && (
                                <div style={styles.userMenu}>
                                    <Link
                                        to="/orders"
                                        style={styles.menuItem}
                                        onClick={() => setShowUserMenu(false)}
                                        onMouseEnter={(e) => {
                                            Object.assign(e.currentTarget.style, styles.menuItemHover)
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = 'transparent'
                                            e.currentTarget.style.color = '#222'
                                        }}
                                    >
                                        <span style={styles.menuIcon}>📦</span>
                                        <span>Historial de Compras</span>
                                    </Link>
                                    <div
                                        style={{ ...styles.menuItem, borderBottom: 'none' }}
                                        onClick={() => {
                                            console.log('Logout clicked')
                                            setShowUserMenu(false)
                                        }}
                                        onMouseEnter={(e) => {
                                            Object.assign(e.currentTarget.style, styles.menuItemHover)
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = 'transparent'
                                            e.currentTarget.style.color = '#222'
                                        }}
                                    >
                                        <span style={styles.menuIcon}>🚪</span>
                                        <span>Cerrar Sesión</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    <div ref={coinsMenuRef} style={{ position: 'relative' }}>
                        <div
                            style={styles.coinsBadge}
                            onClick={() => setShowCoinsMenu(!showCoinsMenu)}
                            onMouseEnter={(e) => {
                                Object.assign(e.currentTarget.style, styles.coinsBadgeHover)
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)'
                                e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.15)'
                            }}
                        >
                            <span>🪙</span>
                            <span>{availableCoins}</span>
                        </div>

                        {showCoinsMenu && (
                            <div style={styles.userMenu}>
                                <div
                                    style={{ ...styles.menuItem, borderBottom: 'none' }}
                                    onClick={handleUpdateCoins}
                                    onMouseEnter={(e) => {
                                        Object.assign(e.currentTarget.style, styles.menuItemHover)
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = 'transparent'
                                        e.currentTarget.style.color = '#222'
                                    }}
                                >
                                    <span style={styles.menuIcon}>🎮</span>
                                    <span>Actualizar Monedas del Juego</span>
                                </div>
                            </div>
                        )}
                    </div>
                    <Link to="/cart" style={{ textDecoration: 'none' }}>
                        <CartWidget />
                    </Link>
                </div>
            </nav>
        </>
    )
}
