import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import MainMenu from './components/MainMenu'
import ZinniaISSGame from './components/ZinniaISSGame'
import ComingSoon from './components/ComingSoon'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<MainMenu />} />
            <Route path="zinnia" element={<ZinniaISSGame />} />
            <Route path="crystal-growth" element={<ComingSoon />} />
            <Route path="fluid-dynamics" element={<ComingSoon />} />
          </Route>
        </Routes>
      </div>
    </Router>
  )
}

export default App
