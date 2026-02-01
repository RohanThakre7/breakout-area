import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { store } from './redux/store'
import App from './App'
import './index.css'
import { Toaster } from 'react-hot-toast'
import setupAxios from './utils/axiosSetup'

setupAxios(store);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <Toaster position="bottom-right" />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
)
