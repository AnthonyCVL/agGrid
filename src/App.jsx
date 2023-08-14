import './Menu.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

//importamos los comp creados
import Tablero from './Tablero';
import Tablerow from './Tablerow';
import Metadatos from './Metadatos';
import MetadatosTecnicos from './MetadatosTecnicos';
import Menu from './Menu';
import MetadatosOperacionales from './MetadatosOperacionales';
import Mantenimiento from './Mantenimiento';
import CabeceraDetalle from './CabeceraDetalle';

function Appss() {
  const [listCabeceraDetalle, setListCabeceraDetalle] = useState([])
  const [test, setTest] = useState({})
  const [url, setUrl] = useState(null)
  const p_params = {}
  const idrol = 3
  p_params.header = {}
  p_params.detail = {}
  p_params.header.titulo = 'Metadatos de Procesos'
  p_params.header.subtitulo = 'Proceso'
  p_params.header.full_qry = 'SELECT * FROM D_EWAYA_CONFIG.vw_metadatosprocesoscab WHERE estado=1'
  p_params.header.id_combo = 'nombre_proceso'
  p_params.header.desc_combo = 'nombre_proceso'
  p_params.header.input = 'id_proceso'
  p_params.detail.full_qry = 'SELECT * FROM D_EWAYA_CONFIG.vw_metadatosprocesosdet'
  p_params.detail.where = 'id_proceso'

  const addElementToArray = async (list, element) => {
    list.push(element)
  }

  const request_gettabledata = async (body) => {
    //const base_url = 'http://localhost:8080'
    const base_url='http://ms-python-teradata-nirvana-qa.apps.ocptest.gp.inet'
    const method = '/getTableData2'
    const request = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: body
    };
    return await send_post(base_url, method, request)
  }

  const send_post = async (base_url, method, request) => {
    const response = await fetch(base_url + method, request)
    const json = await response.json();
    return json
  }

  const getData = async () => {
    const base_url='http://ms-python-teradata-nirvana-qa.apps.ocptest.gp.inet'
    const method = '/getTableData2'
    const request = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        database: 'D_EWAYA_CONFIG',
        table: 'VW_ReporteCabeceraDetalle'
      })
    };
    fetch(base_url + method, request)
      .then(response => response.json())
      .then( data => {
          let arrParams = []
          data.map((el) =>{
            let p_params = {}
            p_params.header = {}
            p_params.detail = {}
            p_params.header.titulo = el.titulo
            p_params.header.subtitulo = el.subtitulo
            p_params.header.nombre_menu = el.nombre_menu
            p_params.header.url = el.url
            p_params.header.full_qry = el.cab_qry
            p_params.header.id_combo = el.id_combo
            p_params.header.desc_combo = el.desc_combo
            p_params.header.input = el.input_detalle
            p_params.detail.full_qry = el.detalle_qry
            p_params.detail.where = el.detalle_param_qry

            
            console.log(p_params)
            setUrl(p_params.header.url)
            console.log("URL")
            console.log(url)
            setTest(p_params)
            //arrParams.push(p_params)
            addElementToArray(arrParams, p_params)
            setListCabeceraDetalle(arrParams)
            console.log("getDataApp.jsx - DATA")
            console.log(arrParams)
            console.log(arrParams.length)
            arrParams.map((el) =>{
              console.log(el)
            })
            console.log("TEST")
            console.log(p_params)
            console.log(test) 
          })
        }
      )
  }

  useEffect(() => {
    getData()
  }, [])

  return (
    <div className="App">
<Routes>
  <Route exact path='/' element={ <Menu p_params={listCabeceraDetalle} enable = {idrol!==3}  /> }>
    <Route index element={ <Tablerow /> } />
    <Route exact path='app' element={ <Tablerow idrol={idrol}/> } />
    <Route exact path='metadatosprocesos' element={ <Metadatos /> } />
    <Route exact path='metadatostecnicos' element={ <MetadatosTecnicos /> } />
    
    {/*{listCabeceraDetalle && listCabeceraDetalle.length 
    ? 
    listCabeceraDetalle.map((el)=>(
      //return el.header.url
      <Route exact  path={el.header.url} element={ <CabeceraDetalle p_params={el} /> } />
      //<Route path='metadatosprocesos' element={ <CabeceraDetalle p_params={el} /> } />
    ))
    : 
    null }*/}

    <Route exact path='metadatosoperacionales' element={ <MetadatosOperacionales /> } />
    <Route exact path='mantenimiento' element={ <Mantenimiento /> } />
    <Route exact path='*' element={ <Navigate replace to="/"/> }/>
  </Route>
</Routes> 
    </div>
    
  );
}

export default Appss;