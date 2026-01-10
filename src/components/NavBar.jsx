import { NavLink } from 'react-router-dom'
import CartWidget from './CartWidget.jsx'

export default function NavBar() {

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
            justifyContent: 'space-between',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            flexWrap: 'wrap',
            gap: '12px'
        },
        titleContainer: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '4px'
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
            gap: '12px'
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
                <div style={styles.coinsBadge}>
                    <span>🪙</span>
                    <span>12526</span>
                </div>
                <CartWidget />
            </div>
        </nav>
    )
}
