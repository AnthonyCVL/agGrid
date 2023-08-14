import './Menu.css';
import React, { useState, useEffect } from 'react';
import App from './App';

function AppData() {
  console.log("Appdataaaa")
  const [listCabeceraDetalle, setListCabeceraDetalle] = useState([])
  const [test, setTest] = useState({})
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
    var promises = []
    promises.push(new Promise())

    
    
    console.log("getDataApp.jsx")
    try {
      let arrParams = []
      const resultados = await Promise.all(promises.map(function (key) {
      const data =  request_gettabledata(
        JSON.stringify({
          database: 'D_EWAYA_CONFIG',
          table: 'VW_ReporteCabeceraDetalle'
        })
      )
      data.map((el) =>{
        let p_params = {}
        p_params.header = {}
        p_params.detail = {}
        p_params.header.titulo = el.titulo
        p_params.header.subtitulo = el.subtitulo
        p_params.header.url = el.url
        p_params.header.full_qry = el.cab_qry
        p_params.header.id_combo = el.id_combo
        p_params.header.desc_combo = el.desc_combo
        p_params.header.input = el.input_detalle
        p_params.detail.full_qry = el.detalle_qry
        p_params.detail.where = el.detalle_param_qry
      })
      return p_params
      }
      )
      ).then(
        dt => {
          return dt
        }
      )
      
      setTest(resultados)
      arrParams.push(resultados)
      setListCabeceraDetalle(arrParams)
      console.log("APPDATA")
      console.log(arrParams)
      console.log(test)
    } catch (error) {
      console.error("There has been a problem with your fetch operation:", error);
    }
  }

  useEffect(() => {
    console.log("useeffect")
    getData()
  }, [])

  return (
    <div className="AppData">
    <App params={listCabeceraDetalle}/></div>
  );
}

export default AppData;