import { Outlet, Link } from "react-router-dom"

const Menu = () => {
    return(
        <>
                <div className="navbar-container">
                    <div className="container-logo">
                        <img src={require("./telefonica_logo_blanco.png")} alt="logo" className='main-logo' />
                    </div>
                    <div>
                            <ul className="nav-ul">
                                <li className="nav-link">
                                    <Link to="/app"><a className='nav-a active-link'>Tablero BI</a></Link>
                                    <div className="underline"></div>
                                </li>
                                <li className="nav-link">
                                    <Link to="/metadatos"><a className='nav-a active-link'>Metadatos Criticos</a></Link>
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