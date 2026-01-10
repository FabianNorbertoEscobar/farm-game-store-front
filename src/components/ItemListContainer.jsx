import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import Item from "./Item.jsx"
import getData, { getCategoryData } from "../data/mockService.js"

export default function ItemListContainer() {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const { categoryID } = useParams()

    const shuffleArray = (array) => {
        const shuffled = [...array]
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
        }
        return shuffled
    }

    const formatCategoryLabel = (cat) => {
        const map = { decoracion: 'Decoración', granero: 'Granero', silo: 'Silo', otros: 'Otros' }
        return map[cat] ?? (cat.charAt(0).toUpperCase() + cat.slice(1))
    }

    const pageTitle = categoryID
        ? (categoryID === 'otros' ? 'Otros productos' : `Productos de ${formatCategoryLabel(categoryID)}`)
        : 'Todos los productos'

    useEffect(() => {
        let active = true
        queueMicrotask(() => {
            if (!active) return
            setLoading(true)
            setError(null)
        })

        const fetcher = categoryID ? getCategoryData(categoryID) : getData()

        fetcher
            .then((data) => {
                if (active) setProducts(shuffleArray(data))
            })
            .catch((err) => {
                if (active) setError(err?.message || "Error al cargar productos")
            })
            .finally(() => {
                if (active) setLoading(false)
            })

        return () => { active = false }
    }, [categoryID])

    const styles = {
        section: {
            padding: "24px 20px",
            maxWidth: "1100px",
            margin: "0 auto",
        },
        header: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
            borderBottom: "2px solid #ffdf29",
            paddingBottom: "16px",
            gap: "16px",
            flexWrap: "wrap"
        },
        welcome: {
            fontSize: "16px",
            fontWeight: 600,
            color: "#2bbd2b",
            marginBottom: "12px",
            fontFamily: 'Luckiest Guy, "Segoe UI Emoji", "Noto Color Emoji", sans-serif'
        },
        welcomeTitle: {
            fontSize: "24px",
            fontWeight: 800,
            color: "#1f7a1f",
            display: "block",
            marginBottom: "6px",
            fontFamily: 'Luckiest Guy, "Segoe UI Emoji", "Noto Color Emoji", sans-serif'
        },
        searchInput: {
            padding: "10px 16px 10px 38px",
            borderRadius: "999px",
            border: "2px solid #ffdf29",
            fontSize: "14px",
            fontFamily: 'Luckiest Guy, "Segoe UI Emoji", "Noto Color Emoji", sans-serif',
            outline: "none",
            width: "280px",
            boxShadow: "0 4px 10px rgba(255,223,41,0.2)",
            transition: "all 0.2s ease"
        },
        searchContainer: {
            position: "relative",
            display: "flex",
            alignItems: "center"
        },
        searchIcon: {
            position: "absolute",
            left: "12px",
            fontSize: "16px",
            pointerEvents: "none",
            zIndex: 10,
            fontFamily: '"Segoe UI Emoji", "Noto Color Emoji", sans-serif'
        },
        title: {
            fontSize: "32px",
            margin: 0,
            fontWeight: 800,
            color: "#222",
            letterSpacing: "-0.5px",
        },
        tag: {
            padding: "6px 12px",
            borderRadius: "999px",
            background: "#ffdf29",
            color: "#222",
            fontWeight: 600,
            boxShadow: "0 6px 14px rgba(255,223,41,0.35)",
            textTransform: "capitalize",
        },
        grid: {
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "16px",
        },
        message: {
            padding: "16px",
            background: "#fff8d6",
            borderRadius: "12px",
            border: "1px solid rgba(0,0,0,0.05)",
            fontFamily: 'Luckiest Guy, "Segoe UI Emoji", "Noto Color Emoji", sans-serif'
        }
    }

    const filteredProducts = products.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <section style={styles.section}>
            {!categoryID && (
                <div style={styles.welcome}>
                    <span style={styles.welcomeTitle}>¡Bienvenidos a la tienda de Wonder Farm!</span>
                    Te presentamos las ofertas exclusivas de la tienda online de tu juego de granja favorito! 🐴
                </div>
            )}
            <div style={styles.header}>
                <h2 style={styles.title}>{pageTitle}</h2>
                <div style={styles.searchContainer}>
                    <span style={styles.searchIcon}>🔍</span>
                    <input
                        type="text"
                        placeholder="Buscar productos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={styles.searchInput}
                    />
                </div>
                {categoryID && <span style={styles.tag}>{formatCategoryLabel(categoryID)}</span>}
            </div>

            {loading && <div style={styles.message}>Cargando productos... 🐔 🐄 🐖 🐑 🐐</div>}
            {error && !loading && <div style={styles.message}>{error}</div>}

            {!loading && !error && (
                <div style={styles.grid}>
                    {filteredProducts.map((item) => (
                        <Item key={item.id} {...item} />
                    ))}
                </div>
            )}
        </section>
    )
}
