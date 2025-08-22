import React from 'react'
import { BrowserRouter as Router , Routes , Route } from "react-router-dom";
import Login from "./Pages/Auth/Login"
import UserProvider from "./ContextApi/UserContext"
const App = () => {
  return (
    <UserProvider>
      <Router>
        <Routes>
            <Route path="/" element={<Login/>} />
        </Routes>
      </Router>
    </UserProvider>
    
  )
}

export default App