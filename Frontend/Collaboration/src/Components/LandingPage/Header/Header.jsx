import React, { useState } from 'react';
import { Menu, X, FileText, Code } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LuCode, LuFile, LuUsers } from 'react-icons/lu';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const size = 4;

  const handleNavigation = (nav)=>{
    console.log(nav);
    
    if(nav === "Login")
    {
      return navigate("/Login")
    }
    navigate("/SignUp")
    
  }

  const NavBar = [
    {name : "features"},
    {name : "templates"},
    {name : "pricing"},
    {name : "Login"},

  ]

  return (
    <header className="font-urbanist w-full border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex text-[21px] items-center space-x-2 text-gray-900">
            <span className="font-semibold tracking-wide flex gap-2 text-xl items-center">
              <div className='  w-fit rounded-lg  border-b-4 border-[#6c63ff] flex items-center text-[#6c63ff] font-extrabold border py-2 px-2 '><LuUsers className='size-6'/></div>
              <div className='font-extrabold tracking-wider'>CollabAssign</div>
            </span>
          </div>

          
          <nav className="hidden md:flex items-center space-x-8">
            {
                 NavBar.map((item)=>{
                    return <button onClick={ item.name == "Login" ? ()=>handleNavigation("Login"):""} 
                    className='capitalize text-[16.5px] font-semibold text-gray-900 hover:text-[#6c63ff] cursor-pointer transition-colors duration-200 px-2 py-0.5 focus:outline-none   '>{item.name}</button>
                 })
            }
           
            <button onClick={()=>handleNavigation("SignUp")} className="btn-large">
              Get Started
            </button>
          </nav>

          <button 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

      {isMenuOpen && (
  <div className="md:hidden">
    <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t">
      {/* Menu Links as Buttons */}
      {[
        { name: "Features", action: () => window.location.href = "#features" },
        { name: "Templates", action: () => window.location.href = "#templates" },
        { name: "Pricing", action: () => window.location.href = "#pricing" },
      ].map((item) => (
        <button
          key={item.name}
          onClick={item.action}
          className="block w-full px-3 py-2 text-gray-600 hover:text-[#6c63ff] transition-colors duration-200 tracking-wide text-left"
        >
          {item.name}
        </button>
      ))}

      {/* Buttons */}
      <button
        aria-label="Login"
        className="block w-full px-3 py-2 text-gray-600 hover:text-[#6c63ff] transition-colors duration-200 tracking-wide text-left"
      >
        Login
      </button>
      <button
        onClick={() => handleNavigation("SignUp")}
        className="w-full mt-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium "
      >
        Get Started
      </button>
    </div>
  </div>
)}


      </div>
    </header>
  );
};

export default Header;