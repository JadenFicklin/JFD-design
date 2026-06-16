import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ADMIN_PATH } from './config/admin'
import Layout from './components/Layout'
import Home from './pages/Home'
import Projects from './pages/Projects'
import ProjectDetail from './pages/ProjectDetail'
import AdminStudio from './pages/AdminStudio'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ADMIN_PATH} element={<AdminStudio />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
