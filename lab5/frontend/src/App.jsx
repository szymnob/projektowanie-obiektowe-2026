import { useMemo, useState } from 'react'
import { NavLink, Navigate, Route, Routes } from 'react-router-dom'
import Products from './components/Products'
import Cart from './components/Cart'
import Payments from './components/Payments'
import './App.css'

function App() {
  const [cartItems, setCartItems] = useState([])

  const cartTotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0),
    [cartItems],
  )

  function addToCart(product) {
    setCartItems((current) => {
      const existingItem = current.find((item) => item.id === product.id)
      if (existingItem) {
        return current.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        )
      }

      return [...current, { ...product, quantity: 1 }]
    })
  }

  function increaseQuantity(productId) {
    setCartItems((current) =>
      current.map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    )
  }

  function decreaseQuantity(productId) {
    setCartItems((current) =>
      current
        .map((item) =>
          item.id === productId ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item,
        )
        .filter((item) => item.quantity > 0),
    )
  }

  function removeItem(productId) {
    setCartItems((current) => current.filter((item) => item.id !== productId))
  }

  return (
    <main className="app">
      <header>
        <h1>Sklep</h1>
        <nav className="nav">
          <NavLink to="/produkty">Produkty</NavLink>
          <NavLink to="/koszyk">Koszyk</NavLink>
          <NavLink to="/platnosci">Platnosci</NavLink>
        </nav>
        <p className="summary">
          Pozycji: {cartItems.length} | Suma:{' '}
          {new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' }).format(cartTotal)}
        </p>
      </header>

      <Routes>
        <Route path="/" element={<Navigate to="/produkty" replace />} />
        <Route path="/produkty" element={<Products onAddToCart={addToCart} />} />
        <Route
          path="/koszyk"
          element={
            <Cart
              items={cartItems}
              onIncrease={increaseQuantity}
              onDecrease={decreaseQuantity}
              onRemove={removeItem}
            />
          }
        />
        <Route path="/platnosci" element={<Payments items={cartItems} />} />
      </Routes>
    </main>
  )
}

export default App
