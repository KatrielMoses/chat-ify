// src/main.jsx
import React from 'react'
import { createRoot } from 'react-dom/client'
import './style.css'     // or index.css, wherever you put Tailwind’s @tailwind directives
import App from './App'
import { BrowserRouter } from 'react-router-dom'

const container = document.getElementById('root')
const root = createRoot(container)
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
    
  </React.StrictMode>
)
