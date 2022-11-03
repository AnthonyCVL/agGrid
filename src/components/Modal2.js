import '../stylesheet/Modal.css';
import styled from 'styled-components';
import React, { useState, useEffect } from 'react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import AgGrid from './AgGrid';
import { Button } from 'reactstrap'

function Modal2({open, onClose, p_datatables, p_grouptables}) {

  const [databaseSelect, setDatabaseSelect] = useState([])
  const [databaseValueSelect, setDatabaseValueSelect] = useState({})
  const [databaseObjectSelect, setDatabaseObjectSelect] = useState([])
  const [viewSelect, setViewSelect] = useState([])
  const [viewValueSelect, setViewValueSelect] = useState({})
  const [viewObjectSelect, setViewObjectSelect] = useState([])
  const [groupTypeSelect, setGroupTypeSelect] = useState([])
  const [groupTypeValueSelect, setGroupTypeValueSelect] = useState({})
  const [groupTypeObjectSelect, setGroupTypeObjectSelect] = useState([])
  const [reportTypeSelect, setReportTypeSelect] = useState([])
  const [reportTypeValueSelect, setReportTypeValueSelect] = useState({})
  const [reportTypeObjectSelect, setReportTypeObjectSelect] = useState([])
  const [reportName, setReportName] = useState("")
  const [reportDescription, setReportDescription] = useState("")
  const [viewName, setViewName] = useState("")
  const [viewColumns, setViewColumns] = useState("")
  const [viewSort, setViewSort] = useState("")
  const [viewQuery, setViewQuery] = useState("")

  const databaseHandler = function (e) {
    setDatabaseObjectSelect(e.object)
    setDatabaseValueSelect(e)
  }

  const viewHandler = function (e) {
    setViewObjectSelect(e.object)
    setViewValueSelect(e)
  }

  const groupTypeHandler = function (e) {
    setGroupTypeObjectSelect(e.object)
    setGroupTypeValueSelect(e)
  }

  const reportTypeHandler = function (e) {
    setReportTypeObjectSelect(e.object)
    setReportTypeValueSelect(e)
  }

  const test = async function(e){
    const  response_insert_webgrupo= await request_insertrow(
      JSON.stringify({
        database: 'D_EWAYA_CONFIG',
        table: 'GD_WebGrupo2',
        main_id: 'id_grupo',
        body: JSON.stringify({  name: reportName, 
                                description: reportDescription,
                                id_tipogrupo: groupTypeObjectSelect.id_tipogrupo})
      })
    )
    console.log('viewObjectSelect')
    console.log(viewObjectSelect)
    const response_insert_webreporte = await request_insertrow(
      JSON.stringify({
        database: 'D_EWAYA_CONFIG',
        table: 'GD_WebReporte2',
        main_id: 'id_reporte',
        body: JSON.stringify({  desc_qry: viewName, 
                                database_name: reportTypeObjectSelect.id_tiporeporte==1 ? viewObjectSelect.DataBaseName : 'null',
                                table_name: reportTypeObjectSelect.id_tiporeporte==1 ? viewObjectSelect.TableName : 'null',
                                col_qry: reportTypeObjectSelect.id_tiporeporte==1 ? viewColumns : 'null',
                                ord_qry: reportTypeObjectSelect.id_tiporeporte==1 ? viewSort : 'null',
                                full_qry: reportTypeObjectSelect.id_tiporeporte==2 ? viewQuery : 'null',
                                id_tiporeporte: reportTypeObjectSelect.id_tiporeporte})
      })
    )

    const response_insert_webgruporeporte = await request_insertrow(
      JSON.stringify({
        database: 'D_EWAYA_CONFIG',
        table: 'GD_WebGrupoReporte2',
        body: JSON.stringify({  id_grupo: response_insert_webgrupo['id_grupo'], 
                                id_reporte: response_insert_webreporte['id_reporte'],
                                description: reportDescription})
      })
    )

    console.log(response_insert_webgruporeporte)
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

  const request_insertrow = async (body) => {
    const base_url='http://localhost:8080'
    //const base_url = 'http://ms-python-teradata-nirvana-qa.apps.ocptest.gp.inet'
    const method = '/insertRow'
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

      const listGroupType = await request_gettabledata(
        JSON.stringify({
          database: 'D_EWAYA_CONFIG',
          table: 'VW_TipoWebGrupo'
        })
      )
      const selectGroupType = [];
      /*listDatabase.sort(function (a, b) {
        return a.id - b.id || a.name.localeCompare(b.name);
      });*/
      listGroupType.map(function (obj) {
        selectGroupType.push({ value: obj["nombre"], label: obj["nombre"], object: obj });
      })
      setGroupTypeSelect(selectGroupType)
      setGroupTypeValueSelect(selectGroupType[0])
      setGroupTypeObjectSelect(listGroupType[0])

      const listReportType = await request_gettabledata(
        JSON.stringify({
          database: 'D_EWAYA_CONFIG',
          table: 'VW_TipoWebReporte'
        })
      )

      const selectReportType = [];
      /*listDatabase.sort(function (a, b) {
        return a.id - b.id || a.name.localeCompare(b.name);
      });*/
      listReportType.map(function (obj) {
        selectReportType.push({ value: obj["nombre"], label: obj["nombre"], object: obj });
      })
      setReportTypeSelect(selectReportType)
      setReportTypeValueSelect(selectReportType[0])
      setReportTypeObjectSelect(listReportType[0])
      
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
                <input id="reportName" type='text' className="form-control" 
                value={reportName} onInput={e => setReportName(e.target.value)}></input>
              </div>
            </div>
            <div className="divReportDescription mb-3 row">
              <label for="reportDescription" className="col-sm-2 col-form-label">Descripcion</label>
              <div className="col-sm-4">
                <input id="reportDescription" type='text' className="form-control input" 
                value={reportDescription} onInput={e => setReportDescription(e.target.value)}></input>
              </div>
            </div>
            <div className="divReportType mb-3 row">
              <label for="reportType" className="col-sm-2 col-form-label">Tipo</label>
              <div className="col-sm-4">
              <Select 
                options={groupTypeSelect}
                value={groupTypeValueSelect}
                onChange={(e) => groupTypeHandler(e)}/>
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
              <input id="viewName" type='text' className="form-control input"
              value={viewName} onInput={e => setViewName(e.target.value)}></input>
              </div>
            </div>
            <div className="divViewType mb-3 row">
              <label for="viewType" className="col-sm-2 col-form-label">Tipo</label>
              <div className="col-sm-4">
              <Select 
                options={reportTypeSelect}
                value={reportTypeValueSelect}
                onChange={(e) => reportTypeHandler(e)}/>
              </div>
            </div><div className={`divViewDatabase mb-3 row ${(reportTypeObjectSelect.id_tiporeporte !== 1 ? "div-hidden" : "")}`}>
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
            <div className={`divViewColumns mb-3 row ${(reportTypeObjectSelect.id_tiporeporte !== 1 ? "div-hidden" : "")}`}>
              <label for="viewColumns" className="col-sm-2 col-form-label">Columnas</label>
              <div className="col-sm-4">
              <input id="viewColumns" type='text' className="form-control input"
              value={viewColumns} onInput={e => setViewColumns(e.target.value)}></input>
              </div>
            </div>
            <div className={`divViewSort mb-3 row ${(reportTypeObjectSelect.id_tiporeporte !== 1 ? "div-hidden" : "")}`}>
              <label for="viewSort" className="col-sm-2 col-form-label">Orden</label>
              <div className="col-sm-4">
              <input id="viewSort" type='text' className="form-control input"
              value={viewSort} onInput={e => setViewSort(e.target.value)}></input>
              </div>
            </div>
            <div className={`divViewQuery mb-3 row ${(reportTypeObjectSelect.id_tiporeporte !== 2 ? "div-hidden" : "")}`}>
              <label for="viewQuery" className="col-sm-2 col-form-label">Query</label>
              <div className="col-sm-10">
              <textarea id="viewQuery" type='text' className="form-control"  rows="3"
              value={viewQuery} onInput={e => setViewQuery(e.target.value)}></textarea>
              </div>
            </div>
            <Button
            onClick={(e) => test(e)}>Agregar</Button>
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