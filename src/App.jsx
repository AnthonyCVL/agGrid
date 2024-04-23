import './components/Menu.css';
import React, { useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

//importamos los comp creados
import Tablero from './layout/board/Tablero';
import Metadatos from './layout/metadatos/Metadatos';
import Menu from './components/Menu';
import Mantenimiento from './layout/maintenance/Mantenimiento';
import {variables} from "./utils/variables";

function Appss() {
  const [listCabeceraDetalle, ] = useState([])
  const p_params = {}
  p_params.header = {}
  p_params.detail = {}
  p_params.header.titulo = 'Metadatos de Procesos'
  p_params.header.subtitulo = 'Proceso'
  p_params.header.full_qry = variables.METADATOSPROCESOSCAB
  p_params.header.id_combo = 'nombre_proceso'
  p_params.header.desc_combo = 'nombre_proceso'
  p_params.header.input = 'id_proceso'
  p_params.detail.full_qry = variables.METADATOSPROCESOSDET
  p_params.detail.where = 'id_proceso'

  return (
    <div className="App">
<Routes>
  <Route exact path='/' element={ <Menu p_params={listCabeceraDetalle}/> }>
    <Route index element={ <Tablero /> } />
    <Route exact path='app' element={ <Tablero /> } />
    <Route exact path='metadatosprocesos' element={ <Metadatos value={1}/> } />
    <Route exact path='metadatostecnicos' element={ <Metadatos value={2}/> } />
    <Route exact path='metadatosoperacionales' element={ <Metadatos value={3}/> } />
    <Route exact path='mantenimiento' element={ <Mantenimiento /> } />
    <Route exact path='*' element={ <Navigate replace to="/"/> }/>
  </Route>
</Routes> 
    </div>
    
  );
}

export default Appss;