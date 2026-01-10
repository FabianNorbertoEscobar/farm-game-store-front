import products from "./products.js"
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function getData() {
    await delay(800)
    return products
}

export async function getItemData(itemID) {
    await delay(600)
    const itemRequested = products.find((item) => item.id === Number(itemID))
    if (!itemRequested) {
        throw new Error(`Producto con id ${itemID} no encontrado`)
    }
    return itemRequested
}

export async function getCategoryData(categoryID) {
    await delay(700)
    const cat = String(categoryID).toLowerCase()
    const itemsCategory = products.filter(item => String(item.category).toLowerCase() === cat)
    if (!itemsCategory.length) {
        throw new Error(`No hay productos para la categoría: ${categoryID}`)
    }
    return itemsCategory
}

export async function getCategories() {
    await delay(300)
    const unique = Array.from(new Set(products.map(p => p.category)))
    return unique
}

export async function searchByTitle(query) {
    await delay(300)
    const q = String(query).trim().toLowerCase()
    if (!q) return []
    return products.filter(p => String(p.title).toLowerCase().includes(q))
}

export default getData;