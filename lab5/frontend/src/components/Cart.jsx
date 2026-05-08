import { useMemo, useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

function formatPrice(value) {
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
  }).format(value)
}

function Cart({ items, onIncrease, onDecrease, onRemove }) {
  const [status, setStatus] = useState('')
  const [saving, setSaving] = useState(false)

  const total = useMemo(
    () =>
      items.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0),
    [items],
  )

  async function sendCart() {
    if (items.length === 0) {
      setStatus('Koszyk jest pusty.')
      return
    }

    try {
      setSaving(true)
      setStatus('')
      const payload = {
        items: items.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
      }

      const response = await fetch(`${API_URL}/api/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Nie udało się zapisać koszyka.')
      }

      setStatus(`Koszyk wysłany: ${data.itemsReceived} pozycji.`)
    } catch (sendError) {
      setStatus(sendError.message || 'Błąd podczas wysyłki koszyka.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="card">
      <div className="card-header">
        <h2>Koszyk</h2>
        <span className="meta-pill">{items.length} pozycji</span>
      </div>

      {items.length === 0 && <p>Dodaj produkty, aby utworzyć zamówienie.</p>}

      {items.length > 0 && (
        <ul className="cart-list">
          {items.map((item) => (
            <li key={item.id} className="cart-item">
              <div>
                <strong>{item.name}</strong>
                <p>{formatPrice(item.price)} / szt.</p>
              </div>
              <div className="qty-controls">
                <button type="button" onClick={() => onDecrease(item.id)}>
                  -
                </button>
                <span>{item.quantity}</span>
                <button type="button" onClick={() => onIncrease(item.id)}>
                  +
                </button>
                <button type="button" className="danger-btn" onClick={() => onRemove(item.id)}>
                  Usuń
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="total-row">
        <span>Suma:</span>
        <strong>{formatPrice(total)}</strong>
      </div>

      <button type="button" className="primary-btn" onClick={sendCart} disabled={saving}>
        {saving ? 'Wysyłanie...' : 'Wyślij koszyk do serwera'}
      </button>

      {status && <p className="status-text">{status}</p>}
    </section>
  )
}

export default Cart
