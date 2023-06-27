import React from 'react';
import {Link}from 'react-router-dom';
import '../styles/Navbar.css'
const Navbar = () => {
    return ( 
        <div className="navbar">
            <h1>Text2Fillups</h1>
            <div className="links">
                <Link to="/">Create Fillups</Link>
                <Link to="/about">About</Link>
            </div>
        </div>
     );
}
 
export default Navbar;