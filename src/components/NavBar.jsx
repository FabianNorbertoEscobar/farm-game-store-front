import CartWidget from './CartWidget.jsx'

export default function NavBar() {

    const styles = {
        nav: {
            backgroundColor: '#ffdf29ff',
            color: 'white',
            padding: '16px 32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
        },
        title: {
            margin: 0,
            fontSize: '24px',
            fontWeight: 'bold'
        },
        links: {
            listStyle: 'none',
            display: 'flex',
            gap: '24px',
            margin: 0,
            padding: 0
        },
        link: {
            textDecoration: 'none',
            color: 'white',
            fontSize: '18px'
        },
        linkHover: {
            color: '#2bbd2bff'
        }
    }

    return (
        <nav style={styles.nav}>
            <h2 style={styles.title}>Farm Game</h2>

            <ul style={styles.links}>
                <li>
                    <a
                        href="#"
                        style={styles.link}
                        onMouseEnter={e => e.target.style.color = styles.linkHover.color}
                        onMouseLeave={e => e.target.style.color = styles.link.color}
                    >
                        Granero
                    </a>
                </li>
                <li>
                    <a
                        href="#"
                        style={styles.link}
                        onMouseEnter={e => e.target.style.color = styles.linkHover.color}
                        onMouseLeave={e => e.target.style.color = styles.link.color}
                    >
                        Silo
                    </a>
                </li>
            </ul>

            <CartWidget />
        </nav>
    )
}
