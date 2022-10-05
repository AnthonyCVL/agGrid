import './Menu.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

//importamos los comp creados
import Tablero from './Tablero';
import Metadatos from './Metadatos';
import Home from './components/home';
import Menu from './Menu';

function Appss() {
  return (
    <div className="App">

<BrowserRouter>
<Routes>
  <Route path='/' element={ <Menu /> }>
    <Route index element={ <Tablero /> } />
    <Route path='app' element={ <Tablero /> } />
    <Route path='Metadatos' element={ <Metadatos /> } />
    <Route path='*' element={ <Navigate replace to="/"/> }/>
  </Route>
</Routes> 
</BrowserRouter>

    </div>
  );
}

export default Appss;