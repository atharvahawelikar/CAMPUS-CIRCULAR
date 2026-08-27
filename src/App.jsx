import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Discover from './pages/Discover'
import BorrowRequestForm from './pages/BorrowRequestForm'
import Agreement from './pages/Agreement'
import BorrowingConfirmation from './pages/BorrowingConfirmation'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Discover />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/borrow-request" element={<BorrowRequestForm />} />
        <Route path="/agreement" element={<Agreement />} />
        <Route path="/confirmation" element={<BorrowingConfirmation />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
