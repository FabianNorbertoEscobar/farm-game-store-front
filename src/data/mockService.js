import products from "./products.js"

/**
 * Función auxiliar para simular delay de red
 * @param {number} ms - Milisegundos de espera
 * @returns {Promise<void>}
 */
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Obtener todos los productos (simulación con delay)
 * @returns {Promise<Array>} Array con todos los productos
 */
async function getData() {
    await delay(800)
    return products
}

/**
 * Obtener un producto específico por ID
 * @param {string} itemID - ID del producto
 * @returns {Promise<Object>} Objeto del producto
 * @throws {Error} Si el producto no existe
 */
export async function getItemData(itemID) {
    await delay(600)
    const itemRequested = products.find((item) => item.id === Number(itemID))
    if (!itemRequested) {
        throw new Error(`Producto con id ${itemID} no encontrado`)
    }
    return itemRequested
}

/**
 * Obtener productos filtrados por categoría
 * @param {string} categoryID - Categoría por la cual filtrar
 * @returns {Promise<Array>} Array de productos en la categoría
 * @throws {Error} Si no hay productos en la categoría
 */
export async function getCategoryData(categoryID) {
    await delay(700)
    const cat = String(categoryID).toLowerCase()
    const itemsCategory = products.filter(item => String(item.category).toLowerCase() === cat)
    if (!itemsCategory.length) {
        throw new Error(`No hay productos para la categoría: ${categoryID}`)
    }
    return itemsCategory
}

/**
 * Obtener todas las categorías únicas de los productos
 * @returns {Promise<Array>} Array con nombres de categorías únicas
 */
export async function getCategories() {
    await delay(300)
    const unique = Array.from(new Set(products.map(p => p.category)))
    return unique
}

/**
 * Buscar productos por título
 * @param {string} query - Texto de búsqueda
 * @returns {Promise<Array>} Array de productos que coinciden con la búsqueda
 */
export async function searchByTitle(query) {
    await delay(300)
    const q = String(query).trim().toLowerCase()
    if (!q) return []
    return products.filter(p => String(p.title).toLowerCase().includes(q))
}

/**
 * Crear una nueva orden de compra (simulación)
 * @param {Object} buyOrderData - Datos de la orden
 * @returns {Promise<string>} ID de la orden creada
 */
export async function createBuyOrder(buyOrderData) {
    await delay(500)
    const orderId = `ORDER-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    console.log('Orden creada (mock):', { id: orderId, ...buyOrderData })
    return orderId
}

/**
 * Obtener todas las órdenes del usuario (simulación)
 * @param {number} userId - ID del usuario
 * @returns {Promise<Array>} Array de órdenes del usuario
 */
export async function getOrders(userId) {
    await delay(600)
    // Simular órdenes de ejemplo usando productos reales
    return [
        {
            id: 'ORDER-1737820800-abc123',
            buyer: {
                name: 'Fabián Escobar',
                farmAlias: 'FNEFarm',
                userId: userId
            },
            items: [
                {
                    id: products[0].id,
                    title: products[0].title,
                    category: products[0].category,
                    price: products[0].price,
                    quantity: 1,
                    img: products[0].img
                },
                {
                    id: products[2].id,
                    title: products[2].title,
                    category: products[2].category,
                    price: products[2].price,
                    quantity: 2,
                    img: products[2].img
                }
            ],
            total: products[0].price + (products[2].price * 2),
            createdAt: new Date('2026-01-20T10:30:00')
        },
        {
            id: 'ORDER-1737734400-def456',
            buyer: {
                name: 'Fabián Escobar',
                farmAlias: 'FNEFarm',
                userId: userId
            },
            items: [
                {
                    id: products[3].id,
                    title: products[3].title,
                    category: products[3].category,
                    price: products[3].price,
                    quantity: 1,
                    img: products[3].img
                },
                {
                    id: products[1].id,
                    title: products[1].title,
                    category: products[1].category,
                    price: products[1].price,
                    quantity: 3,
                    img: products[1].img
                }
            ],
            total: products[3].price + (products[1].price * 3),
            createdAt: new Date('2026-01-19T15:45:00')
        }
    ]
}

// Exportación por defecto
export default getData;