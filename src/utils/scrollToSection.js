/**
 * Scroll halus ke section dengan id tertentu TANPA mengubah URL (tidak menambah #hash).
 * Ini sengaja dibuat begitu supaya saat halaman di-refresh, browser tidak "menempel"
 * di section terakhir yang pernah dikunjungi lewat link navigasi.
 */
export function scrollToSection(id) {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
