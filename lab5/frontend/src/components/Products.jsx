import { useEffect, useMemo, useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

function formatPrice(value) {
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
  }).format(value)
}

function Products({ onAddToCart }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function fetchProducts() {
      try {
        setLoading(true)
        setError('')
        const response = await fetch(`${API_URL}/api/products`)

        if (!response.ok) {
          throw new Error('Nie udało się pobrać produktów.')
        }

        const data = await response.json()
        if (isMounted) {
          setProducts(data.products ?? [])
        }
      } catch (fetchError) {
        if (isMounted) {
          setError(fetchError.message || 'Błąd pobierania produktów.')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchProducts()

    return () => {
      isMounted = false
    }
  }, [])

  const productCountLabel = useMemo(() => {
    if (loading) {
      return 'Ładowanie...'
    }
    return `${products.length} produktów`
  }, [loading, products.length])

  return (
    <section className="card">
      <div className="card-header">
        <h2>Produkty</h2>
        <span className="meta-pill">{productCountLabel}</span>
      </div>

      {loading && <p>Trwa pobieranie listy produktów z serwera...</p>}
      {error && <p className="error-text">{error}</p>}

      {!loading && !error && (
        <div className="products-grid">
          {products.map((product) => (
            <article className="product-item" key={product.id}>
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p className="product-meta">Kategoria: {product.category}</p>
              <div className="product-footer">
                <strong>{formatPrice(product.price)}</strong>
                <button
                  type="button"
                  onClick={() => onAddToCart(product)}
                  className="primary-btn"
                >
                  Dodaj do koszyka
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default Products
