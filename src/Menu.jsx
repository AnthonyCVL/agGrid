import React, { useState, useEffect } from 'react';
import { Outlet, Link } from "react-router-dom"
import './Menu.css';

const Menu = (props) => {
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
    useEffect(()=>{
        //make an API call when component first mounts
      },[])
    return(
        <>
                <div className="navbar-container">
                    <div className="container-logo">
                        <img src={require("./telefonica_logo_blanco.png")} alt="logo" className='main-logo' />
                    </div>
                    <div>
                            <ul className="nav-ul">
                                ${true
                                ? 
                                <li className={`nav-link ${clicked === 'app' ? 'active-link' : ''}`}>
                                    <Link to="/app"><a id='app' onClick={handleClick} className="nav-a">Tablero BI</a></Link>
                                    <div className="underline"></div>
                                </li> 
                                : null}
                                ${props.enable
                                ? 
                                <li className={`nav-link ${clicked === 'metadatosprocesos' ? 'active-link' : ''}`}>
                                    <Link to="/metadatosprocesos"><a id='metadatosprocesos' onClick={handleClick} className="nav-a">Metadatos Procesos</a></Link>
                                    <div className="underline"></div>
                                </li>
                                : null}
                                ${props.enable
                                ? 
                                <li className={`nav-link ${clicked === 'metadatostecnicos' ? 'active-link' : ''}`}>
                                    <Link to="/metadatostecnicos"><a id='metadatostecnicos' onClick={handleClick} className="nav-a">Metadatos Tecnicos</a></Link>
                                    <div className="underline"></div>
                                </li>
                                : null}
                                
                                
                                {/*{links.p_params && links.p_params.length 
                                ? 
                                links.p_params.map((el)=>{
                                    console.log("ITER")
                                    console.log(el)
                                    return (<li className={`nav-link ${clicked === el.header.url ? 'active-link' : ''}`}>
                                        <Link to={`/${el.header.url}`}><a id={el.header.url} onClick={handleClick} className="nav-a">{el.header.nombre_menu}</a></Link>
                                        <div className="underline"></div>
                                    </li>)
                                })
                                : 
                                null }*/}
                                ${props.enable
                                ? 
                                <li className={`nav-link ${clicked === 'metadatosoperacionales' ? 'active-link' : ''}`}>
                                    <Link to="/metadatosoperacionales"><a id='metadatosoperacionales' onClick={handleClick} className="nav-a">Metadatos Operacionales</a></Link>
                                    <div className="underline"></div>
                                </li>
                                : null}
                                ${props.enable
                                ? 
                                <li className={`nav-link ${clicked === 'mantenimiento' ? 'active-link' : ''}`}>
                                    <Link to="/mantenimiento"><a id='mantenimiento' onClick={handleClick} className="nav-a">Mantenimiento</a></Link>
                                    <div className="underline"></div>
                                </li>
                                : null}       
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