import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import RenderPage from './RenderPage'
import HomePage from './pages/HomePage'
import AboutUs from './pages/AboutUs'
import BrandStory from './pages/BrandStory'
import OurService from './pages/OurService'
import ServiceDetails from './pages/ServiceDetails'
import HelpfulTools from './pages/HelpfulTools'
import CarRecommendation from './pages/CarRecommendation'
import ContactUs from './pages/ContactUs'
import Discover from './pages/Discover'
import DiscoverDetails from './pages/DiscoverDetails'
import TownDetails from './pages/TownDetails'
import AdminLogin from './pages/Admin/AdminLogin'
import AdminDashboard from './pages/Admin/AdminDashboard'
import TestPage from './pages/TestPage'
import './App.css'

//npm run dev
//npm run preview

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/brand-story" element={<BrandStory />} />
          <Route path="/service" element={<OurService />} />
          <Route path="/service-details/:serviceType" element={<ServiceDetails />} />
          <Route path="/render" element={<RenderPage />} />
          <Route path="/helpful-tools/:tools" element={<HelpfulTools/>} />
          <Route path="/car-recommendation" element={<CarRecommendation/>} />
          <Route path="/contact-us" element={<ContactUs/>} />
          <Route path="/discover" element={<Discover/>} />
          <Route path="/discover-details/:id" element={<DiscoverDetails/>} />
          <Route path="/town-details/:townId" element={<TownDetails />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/test" element={<TestPage />} />
        </Routes>
      </div>
    </Router>
  )
}


export default App
