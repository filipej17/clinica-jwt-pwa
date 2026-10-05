const cacheName = 'clinica-jwt-v3'
const arquivos = [
  '/',
  '/index.html',
  '/painel.html',
  '/style.css',
  '/auth.js',
  '/painel.js',
  '/manifest.json'
]

self.addEventListener('install', event => {
  event.waitUntil(caches.open(cacheName).then(cache => cache.addAll(arquivos)))
  self.skipWaiting()
})

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(chaves =>
      Promise.all(chaves.filter(c => c !== cacheName).map(c => caches.delete(c)))
    )
  )
})

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url)

  // Nunca cachear chamadas da API
  if (event.request.method !== 'GET' || url.pathname.startsWith('/api')) return

  event.respondWith(
    caches.match(event.request).then(resposta => resposta || fetch(event.request))
  )
})
