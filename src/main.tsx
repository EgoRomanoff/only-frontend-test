import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

const rootEl = document.querySelector('#root')

if (!rootEl) {
  throw new Error('No root element')
}

const root = createRoot(rootEl)

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)