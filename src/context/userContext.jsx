/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useContext } from "react";

/**
 * UserContext - Contexto para manejar la información del usuario.
 * Proporciona datos del usuario logueado y helpers para actualizar el saldo
 * de monedas dentro de la aplicación.
 */
const userContext = createContext({
    user: null,
    availableCoins: 0,
    updateCoins: () => { }
});

const DefaultUserProvider = userContext.Provider;

export function UserProvider({ children }) {
    // Usuario hardcodeado con sus monedas (placeholder para demo)
    const [user, setUser] = useState({
        id: 1,
        firstName: "Fabián",
        lastName: "Escobar",
        farmAlias: "FNEFarm",
        coins: 12526,
        avatar: "https://avatars.githubusercontent.com/u/25256803?v=4"
    });

    /**
     * Actualiza el saldo de monedas del usuario.
     * @param {number} newAmount - Nueva cantidad de monedas.
     */
    const updateCoins = (newAmount) => {
        setUser(prevUser => ({
            ...prevUser,
            coins: newAmount
        }));
    };

    /**
     * Resta monedas del usuario sin permitir valores negativos.
     * @param {number} amount - Cantidad a restar.
     */
    const spendCoins = (amount) => {
        setUser(prevUser => ({
            ...prevUser,
            coins: Math.max(0, prevUser.coins - amount)
        }));
    };

    const contextValue = {
        user,
        availableCoins: user.coins,
        updateCoins,
        spendCoins
    };

    return (
        <DefaultUserProvider value={contextValue}>
            {children}
        </DefaultUserProvider>
    );
}

/**
 * Hook personalizado para usar `UserContext`.
 * @returns {Object} - Información del usuario y funciones relacionadas.
 */
export function useUserContext() {
    const context = useContext(userContext);

    if (!context) {
        throw new Error('useUserContext debe ser usado dentro de un UserProvider');
    }

    return context;
}

export default userContext;
