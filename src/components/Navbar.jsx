import { useState } from "react";
import "../style/styles.css";
import { TiThMenu } from "react-icons/ti";
import { IoClose } from "react-icons/io5";

function Navbar(){
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="navbar">
      <div className="bg-gray-100">
        <nav className="bg-white shadow-md w-full">
          <div className="max-w-full px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <img
                  alt="Logo of the Tourist Navigation web app, featuring a stylized compass icon"
                  className="h-8 w-8"
                  src="/src/assets/webicon.jpeg"
                />
                <span className="text-xl font-semibold ml-2">
                  Tourist Navigation
                </span>
              </div>
              {/* <div className="block lg:hidden">
                <button
                  className="text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-700"
                  onClick={toggleSidebar}
                >
                  <TiThMenu size={'2rem'}/>
                </button>
              </div>
              <div className="hidden lg:flex lg:items-center lg:space-x-4">
                <a className="text-gray-700 hover:text-gray-900" href="#">
                  Home
                </a>
                <a className="text-gray-700 hover:text-gray-900" href="#">
                  Map
                </a>
                <a className="text-gray-700 hover:text-gray-900" href="#">
                  Points of Interest
                </a>
                <a className="text-gray-700 hover:text-gray-900" href="#">
                  Contact
                </a>
              </div> */}
            </div>
          </div>
        </nav>

        {isSidebarOpen && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-75 z-100">
            <div className="fixed top-0 left-0 w-64 bg-white h-full shadow-lg">
              <div className="flex items-center justify-between p-4 border-b">
                <span className="text-xl font-semibold">Menu</span>
                <button
                  className="text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-700"
                  onClick={toggleSidebar}
                >
                    <IoClose size={'2rem'}/>
                </button>
              </div>
              <div className="p-4">
                <a
                  className="block text-gray-700 hover:text-gray-900 py-2"
                  href="#"
                >
                  Home
                </a>
                <a
                  className="block text-gray-700 hover:text-gray-900 py-2"
                  href="#"
                >
                  Map
                </a>
                <a
                  className="block text-gray-700 hover:text-gray-900 py-2"
                  href="#"
                >
                  Points of Interest
                </a>
                <a
                  className="block text-gray-700 hover:text-gray-900 py-2"
                  href="#"
                >
                  Contact
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
