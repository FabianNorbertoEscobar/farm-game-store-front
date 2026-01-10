import './App.css'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import NavBar from './components/NavBar.jsx'
import ItemListContainer from './components/ItemListContainer.jsx'
import ItemDetailContainer from './components/ItemDetailContainer.jsx'

function App() {
  return (
    <BrowserRouter>
      <NavBar />

      <Routes>
        <Route path="/" element={<ItemListContainer />} />

        <Route path="/category/:categoryID" element={<ItemListContainer />} />
        <Route path="/product/:itemID" element={<ItemDetailContainer />} />

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
  )
}

export default App
