import './App.css'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import NavBar from './components/NavBar.jsx'
import ItemListContainer from './components/ItemListContainer.jsx'
import ItemDetailContainer from './components/ItemDetailContainer.jsx'
import Cart from './components/Cart.jsx'
import OrderHistory from './components/OrderHistory.jsx'
import { CartProvider } from './context/cartContext.jsx'
import { UserProvider } from './context/userContext.jsx'
import { NotificationProvider } from './context/notificationContext.jsx'

function App() {
  return (
    <NotificationProvider>
      <UserProvider>
        <CartProvider>
          <BrowserRouter>
            <NavBar />

            <Routes>
              <Route path="/" element={<ItemListContainer />} />

              <Route path="/category/:categoryID" element={<ItemListContainer />} />
              <Route path="/product/:itemID" element={<ItemDetailContainer />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/orders" element={<OrderHistory />} />

              <Route
                path="*"
                element={(
                  <div style={{ padding: '32px', textAlign: 'center' }}>
                    <h1>404: Page not found</h1>
                    <Link to="/">Regresar al home</Link>
                  </div>
                )}
              />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </UserProvider>
    </NotificationProvider>
  )
}

export default App
