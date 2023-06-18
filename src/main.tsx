import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import 'bootstrap/dist/css/bootstrap.css';

import { createBrowserRouter, RouterProvider, Navigate} from 'react-router-dom'
import Home from './components/pages/Home.tsx'
import ErrorPage from './components/pages/ErrorPage.tsx'

const router = createBrowserRouter([
  { 
    path: '/', 
    element: <App />,
    errorElement: <ErrorPage/>,
    children: [
      { path: '/', element: <Home /> },
    ]
  },
])

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
