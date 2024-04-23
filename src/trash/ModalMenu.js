import '../stylesheet/Modal.css';
import styled from 'styled-components';
import React, { useState, useEffect } from 'react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import AgGrid from '../components/AgGrid';
import { Button } from 'reactstrap'
import Swal from 'sweetalert2'

function ModalMenu({ open, onClose, p_datatables, p_grouptables }) {

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
  const [reportSubtitle, setReportSubtitle] = useState("")
  const [enableCRUD, setEnableCRUD] = useState("")
  const [hiddenCRUD, setHiddenCRUD] = useState(true)
  const [viewName, setViewName] = useState("")
  const [viewColumns, setViewColumns] = useState("")
  const [viewSort, setViewSort] = useState("")
  const [viewQuery, setViewQuery] = useState("")
  const [flagAction, setFlagAction] = useState("")
  const [reportDate, setReportDate] = useState(new Date().toLocaleString().replace(",",""))

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
    console.log("INSERT")
    clear()
    const newOption = createOption(inputValue);
    //setWebGroupSelect((prev) => [...prev, newOption]);
    setReportName(newOption);
    setReportDescription('')
    setReportSubtitle('')
    setFlagAction('insert')
    console.log(flagAction)
  };


  const webGroupHandler = function (e) {
    console.log("UPDATE")
    clear()
    console.log("webGroupHandler")
    console.log(e)
    setWebGroupObjectSelect(e.object)
    setWebGroupValueSelect(e)
    setReportDescription(e.object.description)
    setReportSubtitle(e.object.subtitle)
    setReportName(createOption(e.object.name))
    setReportDate(webGroupObjectSelect.create_ts)
    setFlagAction('update')
  }

  const showFormCRUD = function (e){
    console.log("showFormCRUD")
    if(enableCRUD==="tablerobi"){
      setHiddenCRUD(false)
    }
  }


  const getReportes = async function (e) {
    console.log("getReportes")
    console.log(webGroupObjectSelect.id_grupo)
    setListView([])
    if(webGroupObjectSelect === "" || webGroupObjectSelect === undefined || webGroupObjectSelect.id_grupo === '' || webGroupObjectSelect.id_grupo === undefined){
      return 0
    }
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
      console.log(response_webbreport)
      if(response_webbreport.length>0){
        setListView(listView => [...listView, response_webbreport[0]])
      }
    })
  }

  const setWebGroup = () => {
    console.log("setWebGroup")
    if (webGroupObjectSelect === '' || webGroupObjectSelect === undefined || webGroupObjectSelect.id_tipogrupo === '' || webGroupObjectSelect.id_tipogrupo === undefined) { 
      console.log("no pase")
      setGroupTypeObjectSelect(groupTypeSelect[0].object)
      setGroupTypeValueSelect(groupTypeSelect[0])
    } else {
      console.log("pase")
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
    if(listView.length>0){
      setViewName(listView[0].desc_qry)
      setViewQuery(listView[0].full_qry)
      setViewColumns(listView[0].col_qry)
      setViewSort(listView[0].ord_qry)
    }
    if (webGroupObjectSelect === '' || webGroupObjectSelect === undefined || webGroupObjectSelect.id_tipogrupo === '' || webGroupObjectSelect.id_tipogrupo === undefined) {
      setReportTypeObjectSelect(reportTypeSelect[0].object)
      setReportTypeValueSelect(reportTypeSelect[0])
      setDatabaseObjectSelect(databaseSelect[0].object)
      setDatabaseValueSelect(databaseSelect[0])
      setViewObjectSelect(viewSelect[0].object)
      setViewValueSelect(viewSelect[0])
    } else {
      if(listView.length>0){
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
  }

  const saveButton = async function (e) {
    console.log("SAVE")
    console.log(flagAction)
    if (flagAction === 'insert') {
      show_modal_insert()
      console.log("insert")
    } else {
      show_modal_update()
      console.log("update")
    }
  }

  const deleteButton = async function (e){
    console.log("DELETE")
    if(flagAction==='update'){
      show_modal_delete()
    }
  }

  const show_modal_delete = async function (e){
    console.log("show_modal_delete")
    console.log(webGroupObjectSelect.id_grupo)
    Swal.fire({
      title: 'Eliminar',
      text: '¿Está seguro de eliminar este registro?',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      showLoaderOnConfirm: true,
      preConfirm: async () => {
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
        if(!response_update_webgrupo.ok){
          show_error()
          return 0;
        }
        const newWebGroup = webGroupSelect.filter((obj) => obj.object.id_grupo !== webGroupObjectSelect.id_grupo);
        console.log(newWebGroup);
        setWebGroupSelect(newWebGroup);
        clear()
        show_ok('Eliminar','Eliminación exitosa')
      }
    })
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

  const show_modal_insert = async function (e) {
    Swal.fire({
      title: 'Registrar',
      text: 'Verifica los datos ingresados',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      showLoaderOnConfirm: true,
      preConfirm: async () => {
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
        const json_insert_webgrupo = await response_insert_webgrupo.json()
        if(!response_insert_webgrupo.ok){
          show_error()
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
        const json_insert_webreporte = await response_insert_webreporte.json()
        if(!response_insert_webreporte.ok){
          show_error()
          return 0;
        }
        const response_insert_webgruporeporte = await request_insertrow(
          JSON.stringify({
            database: 'D_EWAYA_CONFIG',
            table: 'GD_WebGrupoReporteDesa',
            body: JSON.stringify({
              id_grupo: json_insert_webgrupo['id_grupo'],
              id_reporte: json_insert_webreporte['id_reporte'],
              description: reportDescription
            })
          })
        )
    
        if(!response_insert_webgruporeporte.ok){
          show_error()
          return 0;
        }
        show_ok('Registrar','Registro exitoso')
      }
    })
  }

  const show_modal_update = async function (e) {
    Swal.fire({
      title: 'Actualizar',
      text: '¿Está seguro de actualizar este registro?',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      showLoaderOnConfirm: true,
      preConfirm: async () => {
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
        if(!response_update_webgrupo.ok){
          show_error()
          return 0;
        }
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
        if(!response_update_webreporte.ok){
          show_error()
          return 0;
        }
        show_ok('Actualizar','Actualización exitosa')
      }
    })
  }

  const show_modal = (title, text, icon, button) => {
    Swal.fire({
      title: title,
      text: text,
      icon: icon,
      button: button
    })
  }

  const show_ok = (title, text, icon='success', button='Aceptar') => {
    show_modal(title, text, icon, button)
  }

  const show_error = (title='Error', text='Ocurrió un error en la operación', icon='error', button ='Aceptar') => {
    show_modal(title, text, icon, button)
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
    //const base_url = 'http://localhost:8080'
    const base_url = 'http://ms-python-teradata-nirvana-qa.apps.ocptest.gp.inet'
    const method = '/insertRow'
    const request = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: body
    };
    return await send_post_status(base_url, method, request)
  }

  const request_updaterow = async (body) => {
    //const base_url = 'http://localhost:8080'
    const base_url = 'http://ms-python-teradata-nirvana-qa.apps.ocptest.gp.inet'
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
    //setViewSelect([])
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
+      )*/
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
    setHiddenCRUD(true)
    setFlagAction('')
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

  const clear = () => {
    console.log("clear")
    console.log(webGroupObjectSelect.id_grupo)
    setWebGroupObjectSelect([])
    console.log(webGroupObjectSelect)
    setWebGroupValueSelect({})
    //setWebGroupSelect([])
    console.log(webGroupObjectSelect.id_grupo)
    setReportName("")
    setReportDescription("")
    setReportSubtitle("")
    //setGroupTypeSelect([])
    //setGroupTypeValueSelect({})
    //setGroupTypeObjectSelect([])
    setGroupTypeObjectSelect(groupTypeSelect[0].object)
    setGroupTypeValueSelect(groupTypeSelect[0])
    setViewName("")
    //setReportTypeSelect([])
    //setReportTypeValueSelect({})
    //setReportTypeObjectSelect([])
    setReportTypeObjectSelect(reportTypeSelect[0].object)
    setReportTypeValueSelect(reportTypeSelect[0])
    setViewColumns("")
    setViewSort("")
    setViewQuery("")
    //setDatabaseSelect([])
    setDatabaseValueSelect({})
    setDatabaseObjectSelect([])
    //setViewSelect([])
    setViewValueSelect({})
    setViewObjectSelect([])
    //showTables()
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
    if(open) {
      
    }
  }, [flagAction])

  useEffect(() => {
    console.log("EJECUTA???????")
    console.log(webGroupObjectSelect.id_grupo)
    if (open) {
      getReportes()
      setWebGroup()
      if(flagAction === 'update'){
        setReportDate(webGroupObjectSelect.create_ts)
      } else{
        setReportDate(new Date().toLocaleString().replace(",",""))
      }
      //setWebReport()
    }
  }, [webGroupValueSelect])

  useEffect(() => {
    if (open) {
      setWebReport()
    }
  }, [listView])

  useEffect(() => {
    if (open) {
      showFormCRUD()
    }
  }, [enableCRUD])

  const style = {
    control: base => ({
      ...base,
      borderColor: '#06f'
    })
  };

  if (!open) return null;

  return (
    <div onClick={onClose} className='overlay'>
      <div onClick={(e) => {
        e.stopPropagation()
      }
      } className='modalContainer card'> 
      <div class="card-header modalHeader">
        Tablero BI (CRUD) - Reporte
      </div>
        <div className='modalRight modalBody'>
          
          <button type="button" className="btn-close closeBtn" aria-label="Close"
          onClick={() => { onClose(); clear(); window.location.reload();}}/>
          
          <div className={`divPassword col-sm-12 ${(!hiddenCRUD ? "div-hidden" : "")}`} >
            <input id="inputEnableCRUD" type='text' className="form-control input"
              value={enableCRUD} onInput={e => setEnableCRUD(e.target.value)}></input>
          </div>
          <div className={`content ${(hiddenCRUD ? "div-hidden" : "")}`}>
            <form>
              <div className="divReport">
                <div className="divReportName mb-3 row">
                  <label htmlFor="reportName" className="col-sm-2 col-form-label labelForm">Nombre</label>
                  <div className="col-sm-4">
                    <CreatableSelect
                      styles={style}
                      options={webGroupSelect}
                      value={reportName}
                      onCreateOption={handleCreateReport}
                      onChange={webGroupHandler} />
                  </div>
                  <div className="col-sm-1"/>
                  <div className="col-sm-2">
                    <label className="col-form-label labelForm">Fecha mod:</label>
                  </div>
                  <div className="col-sm-3">
                  <label className="date-update col-form-label labelForm">{reportDate}</label>
                  </div>
                </div>
                <div className="divReportDescription mb-3 row">
                  <label htmlFor="reportDescription" className="col-sm-2 col-form-label labelForm">Descripcion</label>
                  <div className="col-sm-10">
                    <input id="reportDescription" type='text' className="form-control input"
                      value={reportDescription} onInput={e => setReportDescription(e.target.value)}></input>
                  </div>
                </div>
                <div className="divReportDescription mb-3 row">
                  <label htmlFor="reportSubtitle" className="col-sm-2 col-form-label labelForm">Subtitulo</label>
                  <div className="col-sm-4">
                    <input id="reportSubtitle" type='text' className="form-control input"
                      value={reportSubtitle} onInput={e => setReportSubtitle(e.target.value)}></input>
                  </div>
                </div>
                {/*<div className="divDatatable">
                  <label htmlFor="reportDatatable">Datatable</label>
                  <AgGrid
                    p_grouptables={p_grouptables}
                    p_datatables={p_datatables} />
    </div>*/}
              </div>
              <form action="" method="post">
                <fieldset className="form-group border border-secondary rounded p-3 viewSection legend-detail">
                <div className="divView card-body ">
                  <div className="divTitle mb-3 row card-title">
                    <legend className="w-auto px-2 title-viewform">Cabecera</legend >
                  </div>
                  <div className="divViewName mb-3 row">
                    <label htmlFor="viewQuery" className="col-sm-2 col-form-label labelForm">Query</label>
                    <div className="col-sm-10">
                      <input id="viewQuery" type='text' className="form-control" rows="1"
                        value={viewQuery} onInput={e => setViewQuery(e.target.value)}></input>
                    </div>
                  </div>  
                  <div className="divViewName mb-3 row">
                    <label htmlFor="viewName" className="col-sm-2 col-form-label labelForm">Desc Combo</label>
                    <div className="col-sm-4">
                      <input id="viewName" type='text' className="form-control input"
                        value={viewName} onInput={e => setViewName(e.target.value)}></input>
                    </div>
                    <label htmlFor="viewName" className="col-sm-2 col-form-label labelForm">Input</label>
                    <div className="col-sm-4">
                      <input id="viewName" type='text' className="form-control input"
                        value={viewName} onInput={e => setViewName(e.target.value)}></input>
                    </div>
                  </div>  
                </div>
                </fieldset>
              </form>
              <form action="" method="post">
                <fieldset className="form-group border border-secondary rounded p-3 viewSection legend-detail">
                <div className="divView card-body ">
                  <div className="divTitle mb-3 row card-title">
                    <legend className="w-auto px-2 title-viewform">Detalle</legend >
                  </div>
                  <div className="divViewName mb-3 row">
                    <label htmlFor="viewQuery" className="col-sm-2 col-form-label labelForm">Query</label>
                    <div className="col-sm-10">
                      <input id="viewQuery" type='text' className="form-control" rows="1"
                        value={viewQuery} onInput={e => setViewQuery(e.target.value)}></input>
                    </div>
                  </div>  
                  <div className="divViewName mb-3 row">
                    <label htmlFor="viewName" className="col-sm-2 col-form-label labelForm">Where</label>
                    <div className="col-sm-4">
                      <input id="viewName" type='text' className="form-control input"
                        value={viewName} onInput={e => setViewName(e.target.value)}></input>
                    </div>
                  </div>
                  <div className="mb-3 row">
                  <div className="col-sm-5"></div>
                  <div className="col-sm-1">
                  <Button disabled={`${(flagAction === '' ? 'true' : '')}`} color="primary"
                    onClick={(e) => saveButton(e)}>{(flagAction === 'update' ? 'Modificar' : 'Crear')}</Button>
                  </div>
                  <div className="col-sm-4"></div>
                  <div className="col-sm-1">
                  <Button color="danger" className={`${(flagAction==='update' ? '' : 'div-hidden')}`}
                        onClick={(e) => deleteButton(e)}>Eliminar</Button>
                  </div>
                  </div>
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

export default ModalMenu;