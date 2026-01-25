import { initializeApp } from "firebase/app";
import {
    addDoc,
    collection,
    doc,
    getDoc,
    getDocs,
    getFirestore,
    query,
    where,
    // eslint-disable-next-line no-unused-vars
    orderBy,
    Timestamp
} from 'firebase/firestore';
import products from "./products";

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCCXNbZiZOl71KEO-fuHHB56U_usG5jx3Q",
    authDomain: "farm-game-store.firebaseapp.com",
    projectId: "farm-game-store",
    storageBucket: "farm-game-store.firebasestorage.app",
    messagingSenderId: "291943454566",
    appId: "1:291943454566:web:a159297f7876a62b13daa7"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Constantes para nombres de colecciones
const COLLECTIONS = {
    PRODUCTS: 'products',
    ORDERS: 'orders'
};

/**
 * Función auxiliar para transformar un documento de Firestore a objeto con id
 * @param {DocumentSnapshot} docSnapshot - Snapshot del documento de Firestore
 * @returns {Object} Datos del documento con el campo id
 */
function mapDocToObject(docSnapshot) {
    return {
        ...docSnapshot.data(),
        id: docSnapshot.id
    };
}

/**
 * Obtener todos los productos desde Firestore
 * @returns {Promise<Array>} Array con todos los productos
 */
async function getData() {
    try {
        const collectionRef = collection(db, COLLECTIONS.PRODUCTS);
        const productsSnapshot = await getDocs(collectionRef);

        return productsSnapshot.docs.map(mapDocToObject);
    } catch (error) {
        console.error('Error fetching products:', error);
        throw new Error('No se pudieron cargar los productos');
    }
}

/**
 * Obtener un producto específico por ID
 * @param {string} itemID - ID del producto
 * @returns {Promise<Object>} Objeto del producto
 */
export async function getItemData(itemID) {
    try {
        const documentRef = doc(db, COLLECTIONS.PRODUCTS, itemID);
        const docSnapshot = await getDoc(documentRef);

        if (!docSnapshot.exists()) {
            throw new Error(`Producto con id ${itemID} no encontrado`);
        }

        return mapDocToObject(docSnapshot);
    } catch (error) {
        console.error(`Error fetching product ${itemID}:`, error);
        throw error;
    }
}

/**
 * Obtener productos filtrados por categoría
 * @param {string} categoryID - Categoría por la cual filtrar
 * @returns {Promise<Array>} Array de productos en la categoría
 */
export async function getCategoryData(categoryID) {
    try {
        const collectionRef = collection(db, COLLECTIONS.PRODUCTS);
        const categoryQuery = query(
            collectionRef,
            where("category", "==", String(categoryID).toLowerCase())
        );
        const productsSnapshot = await getDocs(categoryQuery);

        const products = productsSnapshot.docs.map(mapDocToObject);

        if (!products.length) {
            throw new Error(`No hay productos para la categoría: ${categoryID}`);
        }

        return products;
    } catch (error) {
        console.error(`Error fetching category ${categoryID}:`, error);
        throw error;
    }
}

/**
 * Obtener todas las categorías únicas de los productos
 * @returns {Promise<Array>} Array con nombres de categorías únicas
 */
export async function getCategories() {
    try {
        const allProducts = await getData();
        const categories = Array.from(new Set(allProducts.map(p => p.category)));
        return categories;
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw new Error('No se pudieron cargar las categorías');
    }
}

/**
 * Buscar productos por título
 * @param {string} searchQuery - Texto de búsqueda
 * @returns {Promise<Array>} Array de productos que coinciden con la búsqueda
 */
export async function searchByTitle(searchQuery) {
    try {
        const q = String(searchQuery).trim().toLowerCase();
        if (!q) return [];

        const allProducts = await getData();
        return allProducts.filter(p =>
            String(p.title).toLowerCase().includes(q)
        );
    } catch (error) {
        console.error('Error searching products:', error);
        throw new Error('Error al buscar productos');
    }
}

/**
 * Crear una nueva orden en Firestore
 * @param {Object} buyOrderData - Datos de la orden
 * @returns {Promise<string>} ID de la orden creada
 */
export async function createBuyOrder(buyOrderData) {
    try {
        const collectionRef = collection(db, COLLECTIONS.ORDERS);

        const orderWithMetadata = {
            ...buyOrderData,
            createdAt: Timestamp.now()
        };

        const docRef = await addDoc(collectionRef, orderWithMetadata);

        return docRef.id;
    } catch (error) {
        console.error('Error creating order:', error);
        throw new Error('No se pudo crear la orden');
    }
}

/**
 * Obtener todas las órdenes del usuario
 * @param {number} userId - ID del usuario
 * @returns {Promise<Array>} Array de órdenes del usuario
 */
export async function getOrders(userId) {
    try {
        const collectionRef = collection(db, COLLECTIONS.ORDERS);
        const ordersQuery = query(
            collectionRef,
            where("buyer.userId", "==", userId)
        );
        const ordersSnapshot = await getDocs(ordersQuery);

        const orders = ordersSnapshot.docs.map(mapDocToObject);
        return orders.sort((a, b) => {
            const dateA = a.createdAt?.toDate?.() || a.createdAt;
            const dateB = b.createdAt?.toDate?.() || b.createdAt;
            return new Date(dateB) - new Date(dateA);
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        throw new Error('No se pudieron cargar las órdenes');
    }
}

/**
 * Función utilitaria para exportar productos a Firestore (solo desarrollo)
 * @returns {Promise<void>}
 */
export async function exportProductsToFirestore() {
    try {
        const importedProducts = products.map(item => {
            const { ...productData } = item;
            return productData;
        });

        for (const product of importedProducts) {
            const docRef = await addDoc(collection(db, COLLECTIONS.PRODUCTS), product);
            console.log("Producto creado:", docRef.id);
        }

        console.log(`${importedProducts.length} productos exportados exitosamente`);
    } catch (error) {
        console.error('Error exporting products:', error);
        throw new Error('Error al exportar productos');
    }
}

// Exportación por defecto
export default getData;
