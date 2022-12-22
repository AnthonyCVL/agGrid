import React, { useState, useEffect } from 'react';
import { Outlet, Link } from "react-router-dom"

const Menu = (links) => {
    console.log("LINNNNNNNNNNNNNNNNKS")
    console.log(links)
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
                                <li className={`nav-link ${clicked === 'app' ? 'active-link' : ''}`}>
                                    <Link to="/app"><a id='app' onClick={handleClick} className="nav-a">Tablero BI</a></Link>
                                    <div className="underline"></div>
                                </li>
                                {links.p_params && links.p_params.length 
                                ? 
                                links.p_params.map((el)=>{
                                    console.log("ITER")
                                    console.log(el)
                                    return (<li className={`nav-link ${clicked === el.header.url ? 'active-link' : ''}`}>
                                        <Link to={`/${el.header.url}`}><a id={el.header.url} onClick={handleClick} className="nav-a">{el.header.titulo}</a></Link>
                                        <div className="underline"></div>
                                    </li>)
                                })
                                : 
                                null }
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