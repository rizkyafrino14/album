import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Cegah browser "menempel" di section terakhir yang pernah dikunjungi lewat
// URL hash (mis. #suara) saat halaman di-refresh. Selalu mulai dari paling atas.
if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual'
}
if (window.location.hash) {
  window.history.replaceState(null, '', window.location.pathname + window.location.search)
}
window.scrollTo(0, 0)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
