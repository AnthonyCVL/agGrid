import '../stylesheet/Modal.css';
import styled from 'styled-components';
import React, { useState, useEffect } from 'react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import AgGrid from './AgGrid';
import { Button } from 'reactstrap'

function Modal2({ open, onClose, p_datatables, p_grouptables }) {

  const [databaseSelect, setDatabaseSelect] = useState([])
  const [databaseValueSelect, setDatabaseValueSelect] = useState({})
  const [databaseObjectSelect, setDatabaseObjectSelect] = useState([])
  const [viewElementSelect, setViewElementSelect] = useState("")
  const [viewGeneralSelect, setViewGeneralSelect] = useState([])
  const [viewSelect, setViewSelect] = useState([])
  const [viewValueSelect, setViewValueSelect] = useState({})
  const [viewObjectSelect, setViewObjectSelect] = useState([])
  const [groupTypeSelect, setGroupTypeSelect] = useState([])
  const [groupTypeValueSelect, setGroupTypeValueSelect] = useState({})
  const [groupTypeObjectSelect, setGroupTypeObjectSelect] = useState([])
  const [reportTypeSelect, setReportTypeSelect] = useState([])
  const [reportTypeValueSelect, setReportTypeValueSelect] = useState({})
  const [reportTypeObjectSelect, setReportTypeObjectSelect] = useState([])
  const [webGroupSelect, setWebGroupSelect] = useState([])
  const [webGroupValueSelect, setWebGroupValueSelect] = useState({})
  const [listView, setListView] = useState([])
  const [webGroupObjectSelect, setWebGroupObjectSelect] = useState({})
  const [reportName, setReportName] = useState("")
  const [reportDescription, setReportDescription] = useState("")
  const [viewName, setViewName] = useState("")
  const [viewColumns, setViewColumns] = useState("")
  const [viewSort, setViewSort] = useState("")
  const [viewQuery, setViewQuery] = useState("")
  const [flagAction, setFlagAction] = useState("")

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


  const createOption = (label) => ({
    label,
    value: label
  });

  const handleCreateReport = (inputValue) => {
    const newOption = createOption(inputValue);
    //setWebGroupSelect((prev) => [...prev, newOption]);
    setReportName(newOption);
    setReportDescription('')
    setFlagAction('insert')
  };


  const webGroupHandler = function (e) {
    console.log("webGroupHandler")
    setWebGroupObjectSelect(e.object)
    setWebGroupValueSelect(e)
    setReportDescription(e.object.description)
    setReportName(createOption(e.object.name))
    setFlagAction('update')
  }


  const getReportes = async function (e) {
    console.log("getReportes")
    console.log(webGroupObjectSelect.id_grupo)
    const response_webgroupreport = await request_gettabledata(
      JSON.stringify({
        database: 'D_EWAYA_CONFIG',
        table: 'VW_WebGrupoReporteDesa',
        where: JSON.stringify({ id_grupo: webGroupObjectSelect.id_grupo })
      })
    )
    response_webgroupreport.map(async function (obj) {
      const response_webbreport = await request_gettabledata(
        JSON.stringify({
          database: 'D_EWAYA_CONFIG',
          table: 'VW_WebReporteDesa',
          where: JSON.stringify({ id_reporte: obj.id_reporte })
        }))
      if(response_webbreport.length>0){
        setListView(listView => [...listView, response_webbreport[0]])
      }
    })
  }

  const setWebGroup = () => {
    if (webGroupObjectSelect === '' || webGroupObjectSelect === undefined || webGroupObjectSelect.id_tipogrupo === '' || webGroupObjectSelect.id_tipogrupo === undefined) {
      setGroupTypeObjectSelect(groupTypeSelect[0].object)
      setGroupTypeValueSelect(groupTypeSelect[0])
    } else {
      var elementGroupType = groupTypeSelect.find((el) => {
        return el.object.id_tipogrupo === webGroupObjectSelect.id_tipogrupo
      })
      setGroupTypeObjectSelect(elementGroupType.object)
      setGroupTypeValueSelect(elementGroupType)
    }
  }

  const setWebReport = () => {
    console.log("setWebReport")
    console.log(listView)
    console.log(viewSelect)
    setViewName(listView[0].desc_qry)
    setViewQuery(listView[0].full_qry)
    setViewColumns(listView[0].col_qry)
    setViewSort(listView[0].ord_qry)
    if (webGroupObjectSelect === '' || webGroupObjectSelect === undefined || webGroupObjectSelect.id_tipogrupo === '' || webGroupObjectSelect.id_tipogrupo === undefined) {
      setReportTypeObjectSelect(reportTypeSelect[0].object)
      setReportTypeValueSelect(reportTypeSelect[0])
      setDatabaseObjectSelect(databaseSelect[0].object)
      setDatabaseValueSelect(databaseSelect[0])
      setViewObjectSelect(viewSelect[0].object)
      setViewValueSelect(viewSelect[0])
    } else {
      var elementReportType = reportTypeSelect.find((el) => {
        return el.object.id_tiporeporte === listView[0].id_tiporeporte
      })
      setReportTypeObjectSelect(elementReportType.object)
      setReportTypeValueSelect(elementReportType)

      if(listView[0].id_tiporeporte === 1){
        var elementDatabaseType = databaseSelect.find((el) => {
          return el.object.DataBaseName.toUpperCase() === listView[0].database_name.toUpperCase()
        })
        setDatabaseObjectSelect(elementDatabaseType.object)
        setDatabaseValueSelect(elementDatabaseType)
        /*var elementViewType = viewGeneralSelect.find((el) => {
          return el.DataBaseName.toUpperCase() === listView[0].database_name.toUpperCase() && el.TableName.toUpperCase() === listView[0].table_name.toUpperCase()
        })
        setViewObjectSelect(elementViewType.object)
        setViewValueSelect(elementViewType)*/
        setViewElementSelect(listView[0].table_name)
      }
    }
  }

  const saveButton = async function (e) {
    console.log("SAVE")
    console.log(flagAction)
    if (flagAction === 'insert') {
      insert()
      console.log("insert")
    } else {
      update()
      console.log("update")
    }
  }

  const deleteButton = async function (e){
    console.log("DELETE")
    deleteGW()
  }

  const deleteGW = async function (e) {
    const response_update_webgrupo = await request_updaterow(
      JSON.stringify({
        database: 'D_EWAYA_CONFIG',
        table: 'GD_WebGrupoDesa',
        where: JSON.stringify({ 
          id_grupo: webGroupObjectSelect.id_grupo
        }),
        body: JSON.stringify({
          state: 0
        })
      })
    )
  }

  const update = async function (e) {
    const response_update_webgrupo = await request_updaterow(
      JSON.stringify({
        database: 'D_EWAYA_CONFIG',
        table: 'GD_WebGrupoDesa',
        where: JSON.stringify({ 
          id_grupo: webGroupObjectSelect.id_grupo
        }),
        body: JSON.stringify({
          name: webGroupObjectSelect.name,
          description: reportDescription,
          id_tipogrupo: groupTypeObjectSelect.id_tipogrupo
        })
      })
    )
    const response_update_webreporte = await request_updaterow(
      JSON.stringify({
        database: 'D_EWAYA_CONFIG',
        table: 'GD_WebReporteDesa',
        where: JSON.stringify({ 
          id_reporte: listView[0].id_reporte
        }),
        body: JSON.stringify({  desc_qry: viewName, 
                                database_name: reportTypeObjectSelect.id_tiporeporte==1 ? viewObjectSelect.DataBaseName : 'null',
                                table_name: reportTypeObjectSelect.id_tiporeporte==1 ? viewObjectSelect.TableName : 'null',
                                col_qry: reportTypeObjectSelect.id_tiporeporte==1 ? viewColumns : 'null',
                                ord_qry: reportTypeObjectSelect.id_tiporeporte==1 ? viewSort : 'null',
                                full_qry: reportTypeObjectSelect.id_tiporeporte==2 ? viewQuery : 'null',
                                id_tiporeporte: reportTypeObjectSelect.id_tiporeporte})
      })
    )
  }

  const insert = async function (e) {
    const response_insert_webgrupo = await request_insertrow(
      JSON.stringify({
        database: 'D_EWAYA_CONFIG',
        table: 'GD_WebGrupoDesa',
        main_id: 'id_grupo',
        body: JSON.stringify({
          name: reportName.value,
          description: reportDescription,
          id_tipogrupo: groupTypeObjectSelect.id_tipogrupo
        })
      })
    )
    if(!response_insert_webgrupo.ok){
      return 0;
    }
    const response_insert_webreporte = await request_insertrow(
      JSON.stringify({
        database: 'D_EWAYA_CONFIG',
        table: 'GD_WebReporteDesa',
        main_id: 'id_reporte',
        body: JSON.stringify({
          desc_qry: viewName,
          database_name: reportTypeObjectSelect.id_tiporeporte == 1 ? viewObjectSelect.DataBaseName : 'null',
          table_name: reportTypeObjectSelect.id_tiporeporte == 1 ? viewObjectSelect.TableName : 'null',
          col_qry: reportTypeObjectSelect.id_tiporeporte == 1 ? viewColumns : 'null',
          ord_qry: reportTypeObjectSelect.id_tiporeporte == 1 ? viewSort : 'null',
          full_qry: reportTypeObjectSelect.id_tiporeporte == 2 ? viewQuery : 'null',
          id_tiporeporte: reportTypeObjectSelect.id_tiporeporte
        })
      })
    )
    if(!response_insert_webgrupo.ok){
      return 0;
    }
    const response_insert_webgruporeporte = await request_insertrow(
      JSON.stringify({
        database: 'D_EWAYA_CONFIG',
        table: 'GD_WebGrupoReporteDesa',
        body: JSON.stringify({
          id_grupo: response_insert_webgrupo['id_grupo'],
          id_reporte: response_insert_webreporte['id_reporte'],
          description: reportDescription
        })
      })
    )
  }

  const request_gettabledata = async (body) => {
    //const base_url = 'http://localhost:8080'
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
    const base_url = 'http://localhost:8080'
    //const base_url = 'http://ms-python-teradata-nirvana-qa.apps.ocptest.gp.inet'
    const method = '/insertRow'
    const request = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: body
    };
    return await send_post_status(base_url, method, request)
  }

  const request_updaterow = async (body) => {
    const base_url = 'http://localhost:8080'
    //const base_url = 'http://ms-python-teradata-nirvana-qa.apps.ocptest.gp.inet'
    const method = '/updateRow'
    const request = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: body
    };
    return await send_post_status(base_url, method, request)
  }

  const send_post = async (base_url, method, request) => {
    const response = await fetch(base_url + method, request)
    const json = await response.json();
    return json
  }

  const send_post_status = async (base_url, method, request) => {
    const response = await fetch(base_url + method, request)
    //const json = await response.json();
    return response
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
      /*const list = await request_gettabledata(
        JSON.stringify({
          database: 'D_EWAYA_CONFIG',
          table: 'VW_DATABASEOBJECT',
          where: JSON.stringify({ databasename: databaseObjectSelect.DataBaseName, tablekind: 'V' })
        })
      )*/
      var dataSelect = [];
      /*listDatabase.sort(function (a, b) {
        return a.id - b.id || a.name.localeCompare(b.name);
      });*/
      console.log(viewGeneralSelect)
      console.log(databaseObjectSelect)
      var list = viewGeneralSelect.filter((el) => {
        return el.DataBaseName.toUpperCase() === databaseObjectSelect.DataBaseName.toUpperCase()
      })
      console.log(list)
      list.map(function (obj) {
        dataSelect.push({ value: obj["TableName"], label: obj["TableName"], object: obj });
      })
      var viewValue = dataSelect[0]
      var viewObject = list[0]

      if(viewElementSelect!==null && viewElementSelect!==""){
        var elementGroupType = dataSelect.find((el) => {
          return el.value.toUpperCase() === viewElementSelect.toUpperCase()
        })
        viewValue = elementGroupType
        viewObject = elementGroupType.object
      }
      setViewSelect(dataSelect)
      setViewValueSelect(viewValue)
      setViewObjectSelect(viewObject)
      setViewElementSelect(null)
      console.log(list)
    } catch (error) {
      console.error("There has been a problem with your fetch operation:", error);
    }
  }

  const showTables = async () => {
    console.log("showwwwwwwwTablesssssssssssssssssss")
    try {
      const listV = await request_gettabledata(
        JSON.stringify({
          database: 'D_EWAYA_CONFIG',
          table: 'VW_DATABASEOBJECT',
          where: JSON.stringify({ tablekind: 'V' })
        })
      )
      setViewGeneralSelect(listV)
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
        selectGroupType.push({ value: obj["id_tipogrupo"], label: obj["nombre"], object: obj });
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

      const listWebGroup = await request_gettabledata(
        JSON.stringify({
          database: 'D_EWAYA_CONFIG',
          table: 'VW_WebGrupoDesa',
          where: JSON.stringify({ state: 1 })
        })
      )
      const selectWebGroup = [];
      /*listDatabase.sort(function (a, b) {
        return a.id - b.id || a.name.localeCompare(b.name);
      });*/
      listWebGroup.map(function (obj) {
        selectWebGroup.push({ value: obj["name"], label: obj["name"], object: obj });
      })
      setWebGroupSelect(selectWebGroup)
      //setWebGroupValueSelect("")
      //setWebGroupObjectSelect("")

    } catch (error) {
      console.error("There has been a problem with your fetch operation:", error);
    }
  }

  useEffect(() => {
    if (open) {
      showTables()
    }
  }, [open])

  useEffect(() => {
    if (open) {
      showTableData()
    }
  }, [databaseObjectSelect])

  useEffect(() => {
    console.log("EJECUTA???????")
    if (open) {
      getReportes()
      setWebGroup()
      //setWebReport()
    }
  }, [webGroupValueSelect])

  useEffect(() => {
    if (open) {
      setWebReport()
    }
  }, [listView])

  if (!open) return null;

  return (
    <div onClick={onClose} className='overlay'>
      <div onClick={(e) => {
        e.stopPropagation()
      }
      } className='modalContainer card'> 
      <div class="card-header modalHeader">
        Maestro de Tablero BI
      </div>
        <div className='modalRight modalBody'>
          <p onClick={onClose} className='closeBtn'>X</p>
          <div className='content'>
            <form>
              <div className="divReport">
                <div className="divReportName mb-3 row">
                  <label htmlFor="reportName" className="col-sm-2 col-form-label">Nombre</label>
                  <div className="col-sm-4">
                    <CreatableSelect
                      options={webGroupSelect}
                      value={reportName}
                      onCreateOption={handleCreateReport}
                      onChange={webGroupHandler} />
                  </div>
                </div>
                <div className="divReportDescription mb-3 row">
                  <label htmlFor="reportDescription" className="col-sm-2 col-form-label">Descripcion</label>
                  <div className="col-sm-4">
                    <input id="reportDescription" type='text' className="form-control input"
                      value={reportDescription} onInput={e => setReportDescription(e.target.value)}></input>
                  </div>
                </div>
                <div className="divReportType mb-3 row">
                  <label htmlFor="reportType" className="col-sm-2 col-form-label">Tipo</label>
                  <div className="col-sm-4">
                    <Select
                      options={groupTypeSelect}
                      value={groupTypeValueSelect}
                      onChange={(e) => groupTypeHandler(e)} />
                  </div>
                  <div className="col-sm-4">
                    <Button
                      onClick={(e) => deleteButton(e)}>Eliminar</Button>
                  </div>
                </div>
                {/*div className="divDatatable">
                  <label htmlFor="reportDatatable">Datatable</label>
                  <AgGrid
                    p_grouptables={p_grouptables}
                    p_datatables={p_datatables} />
    </div>*/}
              </div>
              <form action="" method="post">
                    <fieldset className="form-group border border-secondary rounded p-3 viewSection">
              <div className="divView card-body ">
                <div className="divTitle mb-3 row card-title">
                  <legend className="w-auto px-2">Nueva Vista</legend >
                </div>
                <div className="divViewName mb-3 row">
                  <label htmlFor="viewName" className="col-sm-2 col-form-label">Nombre</label>
                  <div className="col-sm-4">
                    <input id="viewName" type='text' className="form-control input"
                      value={viewName} onInput={e => setViewName(e.target.value)}></input>
                  </div>
                </div>
                <div className="divViewType mb-3 row">
                  <label htmlFor="viewType" className="col-sm-2 col-form-label">Tipo</label>
                  <div className="col-sm-4">
                    <Select
                      options={reportTypeSelect}
                      value={reportTypeValueSelect}
                      onChange={(e) => reportTypeHandler(e)} />
                  </div>
                </div>
                <div className={`divViewDatabase mb-3 row ${(reportTypeObjectSelect.id_tiporeporte !== 1 ? "div-hidden" : "")}`}>
                  <label htmlFor="viewDatabase" className="col-sm-2 col-form-label">Base de datos</label>
                  <div className="col-sm-4">
                    <Select
                      options={databaseSelect}
                      value={databaseValueSelect}
                      onChange={(e) => databaseHandler(e)} />
                  </div>

                  <label htmlFor="viewView" className="col-sm-2 col-form-label">Vista</label>
                  <div className="col-sm-4">
                    <Select
                      options={viewSelect}
                      value={viewValueSelect}
                      onChange={(e) => viewHandler(e)} />
                  </div>
                </div>
                <div className={`divViewColumns mb-3 row ${(reportTypeObjectSelect.id_tiporeporte !== 1 ? "div-hidden" : "")}`}>
                  <label htmlFor="viewColumns" className="col-sm-2 col-form-label">Columnas</label>
                  <div className="col-sm-4">
                    <input id="viewColumns" type='text' className="form-control input"
                      value={viewColumns} onInput={e => setViewColumns(e.target.value)}></input>
                  </div>
                </div>
                <div className={`divViewSort mb-3 row ${(reportTypeObjectSelect.id_tiporeporte !== 1 ? "div-hidden" : "")}`}>
                  <label htmlFor="viewSort" className="col-sm-2 col-form-label">Orden</label>
                  <div className="col-sm-4">
                    <input id="viewSort" type='text' className="form-control input"
                      value={viewSort} onInput={e => setViewSort(e.target.value)}></input>
                  </div>
                </div>
                <div className={`divViewQuery mb-3 row ${(reportTypeObjectSelect.id_tiporeporte !== 2 ? "div-hidden" : "")}`}>
                  <label htmlFor="viewQuery" className="col-sm-2 col-form-label">Query</label>
                  <div className="col-sm-10">
                    <textarea id="viewQuery" type='text' className="form-control" rows="3"
                      value={viewQuery} onInput={e => setViewQuery(e.target.value)}></textarea>
                  </div>
                </div>
                <Button
                  onClick={(e) => saveButton(e)}>Agregar</Button>
              </div>
                        </fieldset>
                        </form>
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