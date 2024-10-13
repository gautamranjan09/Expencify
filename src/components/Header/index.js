import React from 'react'
import "./style.css";

const Header = () => {
    function logoutFnc(){
        alert('logout')
    }
  return (
    <div className='navbar'>
        <p className='logo'>Expencify.</p>
        <p onClick={logoutFnc} className='logo link'>Logout</p>
    </div>
  )
}

export default Header;