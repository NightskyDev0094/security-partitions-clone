import React from "react";
import "./index.scss";

const Header = () => {
  const openMenu = (e) => {
    let header = document.querySelector('.header');

    header.classList.toggle('is-open')
  }

  return (
		<div className="header">
      <div>
        <div className="logo">
          <div className="logo-icon"></div>
          <div className="logo-title">Security Partitions</div>
        </div>
        <div className="menu-list">
          <div className="list-items">
            <div>Pricing</div>
            <div>FAQ</div>
            <div>About</div>
          </div>
          <div className="phone-number-button">555-555-5555</div>
        </div>
        <div className="dropdown-list">
          <span onClick={openMenu}></span>
          <div className="list-items">
            <div onClick={openMenu}>Pricing</div>
            <div onClick={openMenu}>FAQ</div>
            <div onClick={openMenu}>About</div>
            <div onClick={openMenu}>555-555-5555</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
