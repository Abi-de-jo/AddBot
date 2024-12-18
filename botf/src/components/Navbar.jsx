import { NavLink } from "react-router-dom";
import { AiOutlineSearch, AiOutlineHome } from "react-icons/ai";
import { BiHeart } from "react-icons/bi";
import { MdAddBox } from "react-icons/md";
import { FaRegUser } from "react-icons/fa";
import "./Navbar.css"; // Ensure this file contains appropriate styles

function Navbar() {
  return (
    <nav className="navbar fixed bottom-0 w-full bg-white shadow-md flex justify-around items-center py-3 md:py-5">
      <NavLink to="/home" className="nav-item" activeclassname="active">
        <AiOutlineHome size={32} className="text-gray-600 hover:text-blue-500 transition" />
      </NavLink>

      <NavLink to="/search" className="nav-item" activeclassname="active">
        <AiOutlineSearch size={32} className="text-gray-600 hover:text-blue-500 transition" />
      </NavLink>

      <NavLink to="/favorites" className="nav-item" activeclassname="active">
        <BiHeart size={32} className="text-gray-600 hover:text-blue-500 transition" />
      </NavLink>

      <NavLink to="/ads" className="nav-item" activeclassname="active">
        <MdAddBox size={32} className="text-gray-600 hover:text-blue-500 transition" />
      </NavLink>

      <NavLink to="/profile" className="nav-item" activeclassname="active">
        <FaRegUser size={32} className="text-gray-600 hover:text-blue-500 transition" />
      </NavLink>
    </nav>
  );
}

export default Navbar;
