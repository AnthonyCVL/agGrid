import './Menu.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import React from 'react';

//importamos los comp creados
import Tablero from './Tablero';
import Tablerow from './Tablerow';
import Metadatos from './Metadatos';
import MetadatosTecnicos from './MetadatosTecnicos';
import Menu from './Menu';

function Appss() {
  return (
    <div className="App">

<BrowserRouter>
<Routes>
  <Route path='/' element={ <Menu /> }>
    <Route index element={ <Tablerow /> } />
    <Route path='app' element={ <Tablerow /> } />
    <Route path='metadatos' element={ <Metadatos /> } />
    <Route path='metadatostecnicos' element={ <MetadatosTecnicos /> } />
    <Route path='*' element={ <Navigate replace to="/"/> }/>
  </Route>
</Routes> 
</BrowserRouter>

    </div>
  );
}

export default Appss;