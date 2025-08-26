import React from 'react'
import { BrowserRouter as Router , Routes , Route, Navigate } from "react-router-dom";
import Login from "./Pages/Auth/Login"
import UserProvider from "./ContextApi/UserContext"
import ProtectRoutes from "./Components/ProtectRoutes/ProtectRoutes"
import Dashboard_Instructor from "./Pages/Instructors/DashBoard/Dasboard"
import Dashboard_Student from "./Pages/Students/DashBoard/Dasboard"
import DefaultLayout from "./Layouts/Default/Default"
import CreateAssingment from './Pages/Instructors/CreateAssingment';
import EditAssingments from './Pages/Instructors/EditAssingments';
const App = () => {
  return (
    <UserProvider>
      <Router>
        <Routes>
            <Route index element={<Navigate to={"Login"}/>}/>
            <Route path="/Login" element={<Login/>} />
          
            <Route path="/Instructor"
              element= {<ProtectRoutes status = {["Instructor"]}>
                <DefaultLayout/>
              </ProtectRoutes>}
            >
              <Route index element={<Navigate to="Dashboard" />} />
              <Route path='Dashboard' element={<Dashboard_Instructor/>} />
              <Route path='CreateAssingment' element={<CreateAssingment/>} />
              
            </Route>

            <Route path="/EditAssingments/:AssingmentId"
              element= {<ProtectRoutes status = {["Instructor"]}>
                <EditAssingments/>
              </ProtectRoutes>}
            ></Route>


            <Route path="/Student"
              element= {<ProtectRoutes status = {["Student"]}>
                <DefaultLayout/>
              </ProtectRoutes>}
            >
              <Route path='' element={<Dashboard_Student/>} />
            </Route>
        </Routes>
      </Router>
    </UserProvider>
    
  )
}

export default App