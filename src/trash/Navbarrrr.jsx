import React, { useState, useEffect, useRef } from 'react';
import {BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom'
import './Navbarrrr.scss';

function Navbarrrr() {
    const [clicked, setClicked] = useState(false)
    const handleClick = () => {
        setClicked(!clicked)
    }
    return (
        <div className='sum'>
                <div className="logo">
                    Telefonica
                </div>
                <nav className='item'>
                    <ul className='ul'>
                        <li>
                            <Link to='/'>Home</Link>
                        </li>
                        <li>
                            <Link to='/app'>Tablero BI</Link>
                        </li>
                        <li>
                            <Link to='/metadatos'>Metadatos</Link>
                        </li>
                    </ul>
                </nav>
        </div>
    )
}

export default Navbarrrr
