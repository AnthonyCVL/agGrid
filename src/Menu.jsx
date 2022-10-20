import React, { useState } from 'react';
import { Outlet, Link } from "react-router-dom"

const Menu = () => {
    const [clicked, setClicked] = useState('')
    const handleClick = (e) => {
        console.log('handleClick')
        console.log(clicked)
        const clicked_id = e.target.id
        console.log(clicked_id)
        if(clicked === clicked_id) { 
            setClicked('');
        } else {
            setClicked(clicked_id)
       }
    }
    return(
        <>
                <div className="navbar-container">
                    <div className="container-logo">
                        <img src={require("./telefonica_logo_blanco.png")} alt="logo" className='main-logo' />
                    </div>
                    <div>
                            <ul className="nav-ul">
                                <li className={`nav-link ${clicked === 'app' ? 'active-link' : ''}`}>
                                    <Link to="/app"><a id='app' onClick={handleClick} className="nav-a">Tablero BI</a></Link>
                                    <div className="underline"></div>
                                </li>
                                <li className={`nav-link ${clicked === 'metadatos' ? 'active-link' : ''}`}>
                                    <Link to="/metadatos"><a id='metadatos' onClick={handleClick} className="nav-a">Metadatos de Procesos</a></Link>
                                    <div className="underline"></div>
                                </li>
                                <li className={`nav-link ${clicked === 'metadatostecnicos' ? 'active-link' : ''}`}>
                                    <Link to="/metadatostecnicos"><a id='metadatostecnicos' onClick={handleClick} className="nav-a">Metadatos Tecnicos</a></Link>
                                    <div className="underline"></div>
                                </li>
                                <li className={`nav-link ${clicked === 'metadatosoperacionales' ? 'active-link' : ''}`}>
                                    <Link to="/metadatosoperacionales"><a id='metadatosoperacionales' onClick={handleClick} className="nav-a">Metadatos Operacionales</a></Link>
                                    <div className="underline"></div>
                                </li>
                            </ul>
                    </div>
                </div>

        <section>
            <Outlet></Outlet>
        </section> 
       </> 
    )
}
export default Menu