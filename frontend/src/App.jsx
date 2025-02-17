import { Route, Routes } from "react-router-dom"
import LandingPage from "./pages/LandingPage"
import RegisterPage from "./pages/RegisterPage"
import LoginPage from "./pages/LoginPage"
import ProfilePage from "./pages/ProfilePage"

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth/register" element={<RegisterPage />}/>
        <Route path="/auth/login" element={<LoginPage />}/>
        <Route path="/auth/profile" element={<ProfilePage />}/>
      </Routes>
    </>
  )
}

export default App
