import { useState } from 'react'
import './App.css'

const SAMPLE_PRODUCTS = [
  { id: 1, name: 'Pencil', price: 10 },
  { id: 2, name: 'Notebook', price: 45 },
  { id: 3, name: 'Eraser', price: 8 },
  { id: 4, name: 'Highlighter', price: 25 },
  { id: 5, name: 'Stapler', price: 120 },
]

function App() {
  const [cart, setCart] = useState([
    { id: 1, name: 'Pencil', price: 10 },
  ])
  const [status, setStatus] = useState(null) // 'loading' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('')

  const addToCart = (product) => {
    setCart((prev) => [...prev, { ...product, id: Date.now() }])
    setStatus(null)
  }

  const removeFromCart = (index) => {
    setCart((prev) => prev.filter((_, i) => i !== index))
    setStatus(null)
  }

  const checkout = async () => {
    if (cart.length === 0) {
      setStatus('error')
      setErrorMessage('Cart is empty')
      return
    }
    setStatus('loading')
    setErrorMessage('')
    try {
      const res = await fetch('/payment-service', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cart: cart.map(({ id, name, price }) => ({ id, name, price })),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Checkout failed')
      setStatus('success')
      setCart([])
    } catch (err) {
      setStatus('error')
      setErrorMessage(err.message || 'Something went wrong')
    }
  }

  const total = cart.reduce((sum, item) => sum + item.price, 0)

  return (
    <div className="app">
      <header className="header">
        <h1>Checkout</h1>
        <p className="tagline">Cart → Payment service (Kafka)</p>
      </header>

      <main className="main">
        <section className="section products">
          <h2>Add to cart</h2>
          <div className="product-grid">
            {SAMPLE_PRODUCTS.map((product) => (
              <button
                key={product.id}
                type="button"
                className="product-card"
                onClick={() => addToCart(product)}
              >
                <span className="product-name">{product.name}</span>
                <span className="product-price">₹{product.price}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="section cart-section">
          <h2>Cart</h2>
          {cart.length === 0 ? (
            <p className="cart-empty">Your cart is empty. Add items above.</p>
          ) : (
            <>
              <ul className="cart-list">
                {cart.map((item, index) => (
                  <li key={`${item.id}-${index}`} className="cart-item">
                    <div className="cart-item-info">
                      <span className="cart-item-name">{item.name}</span>
                      <span className="cart-item-price">₹{item.price}</span>
                    </div>
                    <button
                      type="button"
                      className="cart-remove"
                      onClick={() => removeFromCart(index)}
                      aria-label={`Remove ${item.name}`}
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
              <div className="cart-footer">
                <div className="cart-total">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
                <button
                  type="button"
                  className="checkout-btn"
                  onClick={checkout}
                  disabled={status === 'loading'}
                >
                  {status === 'loading' ? 'Sending…' : 'Proceed to payment'}
                </button>
              </div>
            </>
          )}
        </section>
      </main>

      {status === 'success' && (
        <div className="toast toast-success" role="status">
          Payment request sent successfully.
        </div>
      )}
      {status === 'error' && (
        <div className="toast toast-error" role="alert">
          {errorMessage}
        </div>
      )}
    </div>
  )
}

export default App
