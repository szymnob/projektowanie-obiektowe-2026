import { useMemo, useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

function formatPrice(value) {
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
  }).format(value)
}

function Payments({ items }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    address: '',
    method: 'card',
    cardNumber: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus] = useState('')

  const total = useMemo(
    () => items.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0),
    [items],
  )

  function updateField(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  async function onSubmit(event) {
    event.preventDefault()
    setStatus('')

    if (items.length === 0) {
      setStatus('Nie można opłacić pustego koszyka.')
      return
    }

    if (!form.name || !form.email || !form.address) {
      setStatus('Uzupełnij dane płatności.')
      return
    }

    try {
      setSubmitting(true)

      const payload = {
        name: form.name,
        email: form.email,
        address: form.address,
        method: form.method,
        cardLast4: form.cardNumber.slice(-4),
        cartItems: items.length,
        totalCents: Math.round(total * 100),
        clientOrderId: `WEB-${Date.now()}`,
      }

      const response = await fetch(`${API_URL}/api/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Nie udało się zrealizować płatności.')
      }

      setStatus(`Płatność zakończona. Numer zamówienia: ${data.serverOrderID}`)
      setForm((current) => ({ ...current, cardNumber: '' }))
    } catch (paymentError) {
      setStatus(paymentError.message || 'Błąd płatności.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="card">
      <div className="card-header">
        <h2>Płatności</h2>
        <span className="meta-pill">Do zapłaty: {formatPrice(total)}</span>
      </div>

      <form className="payment-form" onSubmit={onSubmit}>
        <label>
          Imię i nazwisko
          <input name="name" value={form.name} onChange={updateField} required />
        </label>

        <label>
          E-mail
          <input type="email" name="email" value={form.email} onChange={updateField} required />
        </label>

        <label>
          Adres dostawy
          <input name="address" value={form.address} onChange={updateField} required />
        </label>

        <label>
          Metoda płatności
          <select name="method" value={form.method} onChange={updateField}>
            <option value="card">Karta</option>
            <option value="blik">BLIK</option>
            <option value="transfer">Przelew</option>
          </select>
        </label>

        <label>
          Numer karty (opcjonalnie)
          <input
            name="cardNumber"
            value={form.cardNumber}
            onChange={updateField}
            placeholder="1234 1234 1234 1234"
          />
        </label>

        <button type="submit" className="primary-btn" disabled={submitting}>
          {submitting ? 'Przetwarzanie...' : 'Zatwierdź płatność'}
        </button>
      </form>

      {status && <p className="status-text">{status}</p>}
    </section>
  )
}

export default Payments
