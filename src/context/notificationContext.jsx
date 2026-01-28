/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useContext } from "react";
import Snackbar from "../components/Snackbar.jsx";

/**
 * NotificationContext - Contexto para notificaciones globales.
 * Expone una función `showNotification` para mostrar un mensaje temporal
 * en cualquier parte de la app, renderizando el componente `Snackbar`.
 */

const notificationContext = createContext({
    showNotification: () => { }
});

export function NotificationProvider({ children }) {
    /**
     * Estado interno de la notificación actual.
     * - message: texto a mostrar
     * - isVisible: visibilidad del Snackbar
     * - duration: duración en ms (opcional)
     */
    const [notification, setNotification] = useState({
        message: '',
        isVisible: false
    });

    /**
     * Muestra una notificación.
     * @param {string} message - Mensaje a mostrar.
     * @param {number} duration - Duración en ms (por defecto 5000).
     */
    const showNotification = (message, duration = 5000) => {
        setNotification({
            message,
            isVisible: true,
            duration
        });
    };

    /**
     * Oculta la notificación actual.
     */
    const hideNotification = () => {
        setNotification({
            message: '',
            isVisible: false
        });
    };

    return (
        <notificationContext.Provider value={{ showNotification }}>
            {children}
            <Snackbar
                message={notification.message}
                isVisible={notification.isVisible}
                onClose={hideNotification}
                duration={notification.duration}
            />
        </notificationContext.Provider>
    );
}

export function useNotification() {
    /**
     * Hook para consumir `NotificationContext`.
     * @returns {{ showNotification: Function }}
     */
    const context = useContext(notificationContext);

    if (!context) {
        throw new Error('useNotification debe ser usado dentro de un NotificationProvider');
    }

    return context;
}

export default notificationContext;
