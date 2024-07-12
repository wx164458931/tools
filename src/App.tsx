import { RouterProvider } from 'react-router-dom'
import useDynamicRoutes from './router'
import './App.css'
import './styles/common.scss'

function App() {
  const router = useDynamicRoutes()
  return (
    <div className="app-container">
      <RouterProvider router={router}/>
    </div>
  )
}

export default App
