/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useContext } from "react";
import Snackbar from "../components/Snackbar.jsx";

const notificationContext = createContext({
    showNotification: () => { }
});

export function NotificationProvider({ children }) {
    const [notification, setNotification] = useState({
        message: '',
        isVisible: false
    });

    const showNotification = (message, duration = 5000) => {
        setNotification({
            message,
            isVisible: true,
            duration
        });
    };

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
    const context = useContext(notificationContext);

    if (!context) {
        throw new Error('useNotification debe ser usado dentro de un NotificationProvider');
    }

    return context;
}

export default notificationContext;
