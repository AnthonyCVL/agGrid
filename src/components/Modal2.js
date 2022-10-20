import '../stylesheet/Modal.css';
import styled from 'styled-components';
import React, { useState, useEffect } from 'react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import Select from 'react-select';
import AgGrid from './AgGrid';
import { Button } from 'reactstrap'

function Modal2({open, onClose, p_datatables, p_grouptables}) {

  const [databaseSelect, setDatabaseSelect] = useState([])
  const [databaseValueSelect, setDatabaseValueSelect] = useState({})
  const [databaseObjectSelect, setDatabaseObjectSelect] = useState([])
  const [viewSelect, setViewSelect] = useState([])
  const [viewValueSelect, setViewValueSelect] = useState({})
  const [viewObjectSelect, setViewObjectSelect] = useState([])

  const databaseHandler = function (e) {
    setDatabaseObjectSelect(e.object)
    setDatabaseValueSelect(e)
  }

  const viewHandler = function (e) {
    setViewObjectSelect(e.object)
    setViewValueSelect(e)
  }

  const request_gettabledata = async (body) => {
    //const base_url='http://localhost:8080'
    const base_url = 'http://ms-python-teradata-nirvana-qa.apps.ocptest.gp.inet'
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

  const showTableData = async () => {
    console.log("showTableData")
    setViewSelect([])
    setViewValueSelect("")
    setViewObjectSelect([])
    console.log(databaseObjectSelect)
    try {
      if (databaseObjectSelect.DataBaseName == "" || databaseObjectSelect.DataBaseName == undefined) {
        console.log("no pase")
        return;
      }

      console.log("pasee")
      const list = await request_gettabledata(
        JSON.stringify({
          database: 'D_EWAYA_CONFIG',
          table: 'VW_DATABASEOBJECT',
          where: JSON.stringify({ databasename: databaseObjectSelect.DataBaseName, tablekind: 'V' })
        })
      )
      const dataSelect = [];
      /*listDatabase.sort(function (a, b) {
        return a.id - b.id || a.name.localeCompare(b.name);
      });*/
      list.map(function (obj) {
        dataSelect.push({ value: obj["TableName"], label: obj["TableName"], object: obj });
      })
      setViewSelect(dataSelect)
      setViewValueSelect(dataSelect[0])
      setViewObjectSelect(list[0])
      console.log(list)
    } catch (error) {
      console.error("There has been a problem with your fetch operation:", error);
    }
  }

  const showTables = async () => {
    console.log("showwwwwwwwTablesssssssssssssssssss")
    try {
      //const response = await fetch('http://localhost:8080/getTableData?database=D_EWAYA_CONFIG&table=TB_CONFIG_FE_GROUP');
      const list = await request_gettabledata(
        JSON.stringify({
          database: 'D_EWAYA_CONFIG',
          table: 'VW_DATABASE'
        })
      )
      const dataSelect = [];
      /*listDatabase.sort(function (a, b) {
        return a.id - b.id || a.name.localeCompare(b.name);
      });*/
      list.map(function (obj) {
        dataSelect.push({ value: obj["DataBaseName"], label: obj["DataBaseName"], object: obj });
      })
      setDatabaseSelect(dataSelect)
      setDatabaseValueSelect(dataSelect[0])
      setDatabaseObjectSelect(list[0])
    } catch (error) {
      console.error("There has been a problem with your fetch operation:", error);
    }
  }

  useEffect(() => {
    showTables()
  }, [])

  useEffect(() => {
    showTableData()
  }, [databaseObjectSelect])

  if(!open) return null;
  
  return (
    <div onClick = {onClose}className='overlay'>
    <div onClick={(e) => {
      e.stopPropagation()
    }
    }className='modalContainer'>
      Reporte
      <div className='modalRight'>
        <p onClick={onClose} className='closeBtn'>X</p>
        <div className='content'>
          <form>
          <div className="divReport">
            <div className="divReportName mb-3 row">
              <label for="reportName" className="col-sm-2 col-form-label">Nombre</label>
              <div class="col-sm-4">
                <input id="reportName" type='text' className="form-control"></input>
              </div>
            </div>
            <div className="divReportDescription mb-3 row">
              <label for="reportDescription" className="col-sm-2 col-form-label">Descripcion</label>
              <div className="col-sm-4">
                <input id="reportDescription" type='text' className="form-control input"></input>
              </div>
            </div>
            <div className="divReportType mb-3 row">
              <label for="reportType" className="col-sm-2 col-form-label">Tipo</label>
              <div className="col-sm-4">
              <Select/>
              </div>
            </div>
            <div className="divDatatable">
              <label for="reportDatatable">Datatable</label>
              <AgGrid 
                p_grouptables = {p_grouptables}
                p_datatables = {p_datatables}/>
            </div>
          </div>
          <div className="divView">
            <div className="divTitle mb-3 row">
              <label for="viewTitle">Nueva Vista</label>
            </div>
            <div className="divViewName mb-3 row">
              <label for="viewName" className="col-sm-2 col-form-label">Nombre</label>
              <div className="col-sm-4">
              <input id="viewName" type='text' className="form-control input"></input>
              </div>
            </div>
            <div className="divViewType mb-3 row">
              <label for="viewType" className="col-sm-2 col-form-label">Tipo</label>
              <div className="col-sm-4">
              <Select/>
              </div>
            </div>
            <div className="divViewDatabase mb-3 row">
              <label for="viewDatabase" className="col-sm-2 col-form-label">Base de datos</label>
              <div className="col-sm-4">
              <Select 
                options={databaseSelect}
                value={databaseValueSelect}
                onChange={(e) => databaseHandler(e)}/>
              </div>
              
              <label for="viewView" className="col-sm-2 col-form-label">Vista</label>
              <div className="col-sm-4">
              <Select 
                options={viewSelect}
                value={viewValueSelect}
                onChange={(e) => viewHandler(e)}/>
              </div>
            </div>
            <div className="divViewColumns mb-3 row">
              <label for="viewColumns" className="col-sm-2 col-form-label">Columnas</label>
              <div className="col-sm-4">
              <input id="viewColumns" type='text' className="form-control input"></input>
              </div>
            </div>
            <div className="divViewSort mb-3 row">
              <label for="viewSort" className="col-sm-2 col-form-label">Orden</label>
              <div className="col-sm-4">
              <input id="viewSort" type='text' className="form-control input"></input>
              </div>
            </div>
            <Button>Agregar</Button>
          </div>
          </form>
        </div>
        {/*<div className='btnContainer'>
          <button className='btnPrimary'>
            <span className='bold'>YES  </span>, I love NFT's
          </button>
          <button className='btnOutline'>
            <span className='bold'>NO</span>, thanks
          </button>
          </div>
          */}
      </div>
      </div>
    </div>
  );
}

export default Modal2;