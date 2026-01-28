/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useContext, useEffect } from "react";

/**
 * CartContext - Contexto para manejar el carrito de compras.
 * Centraliza el estado del carrito y expone helpers para agregar, remover
 * y actualizar cantidades. Además, persiste el estado en localStorage
 * para conservar el carrito entre recargas.
 */
const cartContext = createContext({
    cart: [],
    addItemToCart: () => { },
    removeItemFromCart: () => { },
    updateItemQuantity: () => { },
    clearCart: () => { },
    isInCart: () => { },
    getItemQuantity: () => { },
    countItemsInCart: () => { },
    calculateTotalPrice: () => { },
    getCartTotal: () => { }
});

const DefaultContextProvider = cartContext.Provider;

export function CartProvider({ children }) {
    // Inicializar el carrito vacío
    const [cart, setCart] = useState([]);

    // Guardar el carrito en localStorage cada vez que cambie
    useEffect(() => {
        try {
            localStorage.setItem('farmGameCart', JSON.stringify(cart));
        } catch (error) {
            console.error('Error al guardar el carrito en localStorage:', error);
        }
    }, [cart]);

    /**
     * Agrega un item al carrito o actualiza su cantidad si ya existe.
     * @param {Object} item - Producto a agregar (debe incluir `id`, `title`, `price`, `img`, `category`).
     * @param {number} count - Cantidad a agregar (mayor a 0).
     */
    function addItemToCart(item, count) {
        if (!item || !item.id || count <= 0) {
            console.warn('Item inválido o cantidad menor o igual a 0');
            return;
        }

        setCart(prevCart => {
            const existingItemIndex = prevCart.findIndex(cartItem => cartItem.id === item.id);

            if (existingItemIndex !== -1) {
                // El item ya existe, actualizar cantidad
                const newCart = structuredClone(prevCart);
                newCart[existingItemIndex].count += count;
                return newCart;
            } else {
                // Agregar nuevo item al carrito
                return [...prevCart, { ...item, count }];
            }
        });
    }

    /**
     * Elimina un item del carrito por su ID.
     * @param {number} idRemove - ID del producto a eliminar.
     */
    function removeItemFromCart(idRemove) {
        setCart(prevCart => prevCart.filter(item => item.id !== idRemove));
    }

    /**
     * Actualiza la cantidad de un item específico en el carrito.
     * Si `newCount` es 0 o menor, elimina el item.
     * @param {number} itemId - ID del producto.
     * @param {number} newCount - Nueva cantidad.
     */
    function updateItemQuantity(itemId, newCount) {
        if (newCount <= 0) {
            removeItemFromCart(itemId);
            return;
        }

        setCart(prevCart => {
            return prevCart.map(item =>
                item.id === itemId
                    ? { ...item, count: newCount }
                    : item
            );
        });
    }

    /**
     * Vacía completamente el carrito.
     */
    function clearCart() {
        setCart([]);
    }

    /**
     * Verifica si un item está en el carrito.
     * @param {number} itemId - ID del producto a verificar.
     * @returns {boolean} - true si el item está en el carrito.
     */
    function isInCart(itemId) {
        return cart.some(item => item.id === itemId);
    }

    /**
     * Obtiene la cantidad de un item específico en el carrito.
     * @param {number} itemId - ID del producto.
     * @returns {number} - Cantidad del item o 0 si no está en el carrito.
     */
    function getItemQuantity(itemId) {
        const item = cart.find(cartItem => cartItem.id === itemId);
        return item ? item.count : 0;
    }

    /**
     * Cuenta el total de unidades en el carrito (suma de todas las cantidades).
     * @returns {number} - Total de items en el carrito.
     */
    function countItemsInCart() {
        return cart.reduce((total, item) => total + item.count, 0);
    }

    /**
     * Calcula el precio total de todos los productos en el carrito.
     * @returns {number} - Precio total del carrito.
     */
    function calculateTotalPrice() {
        return cart.reduce((total, item) => total + (item.price * item.count), 0);
    }

    /**
     * Obtiene un objeto con información resumida del carrito.
     * @returns {Object} - { totalItems, totalPrice, itemCount }.
     */
    function getCartTotal() {
        return {
            totalItems: countItemsInCart(),
            totalPrice: calculateTotalPrice(),
            itemCount: cart.length
        };
    }

    const contextValue = {
        cart,
        addItemToCart,
        removeItemFromCart,
        updateItemQuantity,
        clearCart,
        isInCart,
        getItemQuantity,
        countItemsInCart,
        calculateTotalPrice,
        getCartTotal
    };

    return (
        <DefaultContextProvider value={contextValue}>
            {children}
        </DefaultContextProvider>
    );
}

/**
 * Hook personalizado para usar `CartContext`.
 * Facilita el acceso al estado y helpers del carrito desde cualquier componente.
 * @returns {Object} - Todas las funciones y estado del carrito.
 */
export function useCartContext() {
    const context = useContext(cartContext);

    if (!context) {
        throw new Error('useCartContext debe ser usado dentro de un CartProvider');
    }

    return context;
}

export default cartContext;