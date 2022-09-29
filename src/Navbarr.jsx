import './Metadatos.css';
import React, { useState, useEffect , useRef} from 'react';
import BurguerButton from './BurguerButton';
import styled from 'styled-components';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";

function Navbarr() {

  const [clicked, setClicked] = useState(false)
  const handleClick = () => {
    setClicked(!clicked)
  }
  return (
  <>
    <NavContainer>
      <div class="navbar-container">
      <div class="container-logo">
      <img src={require("./telefonica_logo.png")} alt="logo" className='main-logo'/>
      </div>
      <div>
        <ul>
            <li class="nav-link">
                <a onClick={handleClick} className='active-link' href="#">HOME
                </a>
                <div class="underline"></div>
            </li>
            <li class="nav-link" >
                <a onClick={handleClick} className='active-link' href="#">ABOUT US</a>
                <div class="underline"></div>
            </li>
            <li class="nav-link">
                <a onClick={handleClick} className='active-link' href="#">TESTIMONIALS</a>
                <div class="underline"></div>
            </li>
            <li class="nav-link">
                <a onClick={handleClick} className='active-link' href="#">CONTACT</a>
                <div class="underline"></div>
            </li>
        </ul>
        </div>
      </div>
    </NavContainer>
  </>
  )
}

export default Navbarr

const NavContainer = styled.nav`
body, html {
	margin: 0;
	font-family: Roboto, Arial, helvetica, sans-serif;
}

a {
	outline: none;
}

.navbar-container {
	text-align: center;
	background-color: white;
	box-shadow: 0px -20px 5px 20px #333333;
	padding: 10px;
	font-size: 0;
    font-family: Jadeite Regular;
}

.navbar-container ul {
	margin: 0;
	padding: 0;
	text-align: right;
	display: inline-block;
	vertical-align: middle;
}

.navbar-container ul li {
	display: inline-block;
	font-size: 16px;
}

.navbar-container ul li a {
	color: #031a34;
	text-decoration: none;
	display: inline-block;	
	padding: 10px;
	transition: color 0.5s;
}

.navbar-container ul li .underline {
	height: 3px;
	background-color: transparent;
	width: 0%;
	transition: width 0.2s, background-color 0.5s;
	margin: 0 auto;
}

.navbar-container ul li.active-link .underline {
	width: 100%;
	background-color: #0066ff;
}

.navbar-container ul li:hover .underline {
	background-color: #0066ff;
	width: 100%;
}

.navbar-container ul li:hover a {
}

.navbar-container ul li:active a {
	transition: none;
	color: rgba(255,255,255,0.76);
}

.navbar-container ul li:active .underline {
	transition: none;
	background-color: rgba(255,255,255,0.76);
}

.container-logo{
    width: 180px;
    height: 50px;
}

.main-logo{
    width: 100%;
    height: auto;
}

`