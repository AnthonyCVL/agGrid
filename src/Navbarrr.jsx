import './Navbarrr.css';
import React, { useState, useEffect, useRef } from 'react';
import BurguerButton from './BurguerButton';
import styled from 'styled-components';
import { Navbar, NavDropdown, Form, FormControl, Button, Nav } from 'react-bootstrap'
import {
    BrowserRouter,
    Routes,
    Route,
    Link
} from "react-router-dom";

import Metadatos from './Metadatos';
import App from './App';

function Navbarrr() {
    const [clicked, setClicked] = useState(false)
    const handleClick = () => {
        setClicked(!clicked)
    }
    return (
        <>
                <div class="navbar-container">
                    <div class="container-logo">
                        <img src={require("./telefonica_logo.png")} alt="logo" className='main-logo' />
                    </div>
                    <div>
                            <ul class="nav-ul">
                                <li class="nav-link">
                                    <Link to="/app"><a className='nav-a active-link'>TABLERO BI</a></Link>
                                    <div class="underline"></div>
                                </li>
                                <li class="nav-link">
                                    <Link to="/metadatos"><a className='nav-a active-link'>METADATOS CRITICOS</a></Link>
                                    <div class="underline"></div>
                                </li>
                            </ul>
                    </div>
                        <BrowserRouter>
                            <Routes>
                                <Route path="/app" element={<App />}></Route>
                                <Route path="/metadatos" element={<Metadatos />}></Route>
                            </Routes>
                        </BrowserRouter>
                </div>
        </>
    )
}

export default Navbarrr
