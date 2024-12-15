import { NavLink } from "react-router-dom";
import { AiOutlineSearch, AiOutlineHome } from "react-icons/ai";
import { BiHeart } from "react-icons/bi";
import { MdAddBox } from "react-icons/md";
import { FaRegUser } from "react-icons/fa";
import "./Navbar.css"; // Ensure this file contains appropriate styles

function Navbar() {
  const role = localStorage.getItem("role"); // Retrieve role from localStorage
  const email = localStorage.getItem("email"); // Retrieve email from localStorage

  return (
    <nav className="navbar">
      <NavLink to="/home" className="nav-item" activeclassname="active">
        <AiOutlineHome size={24} />
      </NavLink>

      <NavLink to="/search" className="nav-item" activeclassname="active">
        <AiOutlineSearch size={24} />
      </NavLink>

      <NavLink to="/favorites" className="nav-item" activeclassname="active">
        <BiHeart size={24} />
      </NavLink>

      {/* Show Ads only if role is "agent" or "admin" */}
      {email && (role === "agent" || role === "admin") && (
        <NavLink to="/ads" className="nav-item" activeclassname="active">
          <MdAddBox size={24} />
        </NavLink>
      )}

      <NavLink to="/profile" className="nav-item" activeclassname="active">
        <FaRegUser size={24} />
      </NavLink>
    </nav>
  );
}

export default Navbar;
