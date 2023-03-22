import './Mantenimiento.css';
import React, { useState, useEffect } from 'react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { Button } from 'reactstrap'
import Swal from 'sweetalert2'
import CustomSelect from './components/CustomSelect';

function Mantenimiento() {

  const [webGroupSelect, setWebGroupSelect] = useState([])
  const [webGroupValueSelect, setWebGroupValueSelect] = useState({})
  const [listView, setListView] = useState([])
  const [webGroupObjectSelect, setWebGroupObjectSelect] = useState({})
  const [reportName, setReportName] = useState("")
  const [reportDescription, setReportDescription] = useState("")
  const [enableCRUD, setEnableCRUD] = useState("")
  const [hiddenCRUD, setHiddenCRUD] = useState(true)
  const [viewName, setViewName] = useState("")
  const [viewQuery, setViewQuery] = useState("")
  const [flagAction, setFlagAction] = useState("")
  const [reportDate, setReportDate] = useState(new Date().toLocaleString().replace(",", ""))
  const [chartOptions, setChartOptions] = useState([])
  const [chartValue, setChartValue] = useState({})
  const [chartColumnValue, setChartColumnValue] = useState({})
  const [numChart, setNumChart] = useState(0)
  const [reportColumns, setReportColumns] = useState([])

  const [listChart, setListChart] = useState([])

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
    setReportName(createOption(e.object.name))
    setReportDate(webGroupObjectSelect.create_ts)
    setFlagAction('update')
    setReportColumns([])
    setListChart([])
    setNumChart(0)
  }

  const showFormCRUD = function (e) {
    console.log("showFormCRUD")
    if (enableCRUD === "tablerobi") {
      setHiddenCRUD(false)
    }
  }


  const getReportes = async function (e) {
    console.log("getReportes")
    console.log(webGroupObjectSelect.id_grupo)
    setListView([])
    if (webGroupObjectSelect === "" || webGroupObjectSelect === undefined || webGroupObjectSelect.id_grupo === '' || webGroupObjectSelect.id_grupo === undefined) {
      return 0
    }
    const response_webgroupreport = await request_gettabledata(
      JSON.stringify({
        database: 'D_EWAYA_CONFIG',
        table: 'VW_WebGrupoReporte',
        where: JSON.stringify({ id_grupo: webGroupObjectSelect.id_grupo })
      })
    )
    response_webgroupreport.map(async function (obj) {
      const response_webbreport = await request_gettabledata(
        JSON.stringify({
          database: 'D_EWAYA_CONFIG',
          table: 'VW_WebReporte',
          where: JSON.stringify({ id_reporte: obj.id_reporte })
        }))
      console.log(response_webbreport)
      if (response_webbreport.length > 0) {
        setListView(listView => [...listView, response_webbreport[0]])
      }
      console.log("GD_WebReporteGrafico")
      console.log(obj.id_reporte)
      const response_webreportegrafico = await request_gettabledata(
        JSON.stringify({
          database: 'D_EWAYA_CONFIG',
          table: 'GD_WebReporteGrafico',
          where: JSON.stringify({ id_reporte: obj.id_reporte })
        }))
      console.log("POST QUERY")
      console.log("response: "+response_webreportegrafico)
      console.log(response_webreportegrafico)
      if (response_webreportegrafico.length > 0) {
        console.log("iffffff")
        var list = []
        response_webreportegrafico.map(function (obj) {
          list.push({ id_grafico: obj["id_grafico"], categoria: obj["categoria"], valor: obj["valor"], titulo: obj["titulo"], object: obj });
        })
        console.log(list)
        console.log("ifffend")
        setListChart(list)
      }
    })
     
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

  const deleteButton = async function (e) {
    console.log("DELETE")
    if (flagAction === 'update') {
      show_modal_delete()
    }
  }

  const test = async function(e){
    console.log("test")
    console.log("end test")
  }

  const getQueryColumns = async function(e){
    console.log("getChart")
    var columnsOptions=[]
    if(reportColumns.length==0 && viewQuery!==null && viewQuery!==""){
      const result_columns = await request_getquerycolumns(
        JSON.stringify({
          query: viewQuery
        })
      )
      console.log("result_columns")
      console.log(result_columns)
      var columns = Object.keys(result_columns[0]).map(obj => { 
        return ({value: obj, label: obj})
      })
      var elementContar = {value: "contar", label: "contar"}
      columns.unshift(elementContar)
      setReportColumns(columns)
      console.log(columns)
    }
    console.log("end if")
  }

  const addChart = async function (e) {
    setNumChart((oldNumChart) => oldNumChart + 1)
    const newChart= { id_grafico: chartOptions[0].value, categoria: reportColumns[0].value, valor: reportColumns[0].value, action: 'INSERT'}
    setListChart([...listChart, newChart])
  }

  const onChangeChartSelect = (list, i, key) => (option) => {
    let newList = [...list]
    newList[i][key] =  option.value
    setListChart(newList)
  };

  const onChangeChartInput = (list, i, key) => (option)  => {
    let newList = [...list]
    newList[i][key] =  option.target.value
    setListChart(newList)
  };

  const deleteChart =  function(i) {
    console.log("deleteChart")
    console.log(i)
    console.log(listChart)
    console.log("end deleteChart")
    setNumChart(numChart-1)
    listChart.splice(i, 1)
  }

  const getElementByValue = (list, value) => {
    return list.filter(el => el.value === value)
  }

  const getChartForm = function (e, i) {
    console.log("getChartForm")
    console.log(i)
    console.log(listChart)
    /*let newListChart = [...listChart]
    newListChart[i] = 
    setListChart(newListChart)*/
    if(listChart.length==0){
      return
    }
    return (<div>
              <div className="mb-3 row">
                <div className="col-sm-1">
                  Gráfico {i+1}
                </div>
                <div className="col-sm-6">
                  <input id={"chartValue"+i} type='text' className="form-control input" placeholder="titulo"
                            value={listChart[i]['titulo']}
                            onInput={onChangeChartInput(listChart,i,'titulo')}></input>
                </div>
              </div>
              <div className="mb-3 row">
                <div className="col-sm-1"/>
                <div className="col-sm-2">
                    <Select styles={style} 
                            options={chartOptions} 
                            value={getElementByValue(chartOptions,listChart[i]['id_grafico'])}
                            defaultValue={chartOptions[0]}
                            onChange={onChangeChartSelect(listChart,i,'id_grafico')}/>
                  </div>
                  <div className="col-sm-2">
                    <Select styles={style} 
                            options={reportColumns} 
                            value={getElementByValue(reportColumns,listChart[i]['categoria'])}
                            defaultValue={reportColumns[0]}
                            onChange={onChangeChartSelect(listChart,i,'categoria')}/>
                  </div>
                  
                  <div className="col-sm-2">
                  <Select styles={style} 
                            options={reportColumns} 
                            value={getElementByValue(reportColumns,listChart[i]['valor'])}
                            defaultValue={reportColumns[0]}
                            onChange={onChangeChartSelect(listChart,i,'valor')}/>
                  {/*<input id={"chartValue"+i} type='text' className="form-control input" placeholder="valor"
                            value={listChart[i]['valor']}
                            onInput={onChangeChartInput(listChart,i,'valor')}></input>*/}
                  </div>
                  <div className="col-sm-1">
                    <Button color="danger"  onClick={() => deleteChart(i)}>X</Button>
                  </div>
              </div>
            </div>
    )
  }

  const show_modal_delete = async function (e) {
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
            table: 'GD_WebGrupo',
            where: JSON.stringify({
              id_grupo: webGroupObjectSelect.id_grupo
            }),
            body: JSON.stringify({
              state: 0
            })
          })
        )
        if (!response_update_webgrupo.ok) {
          show_error()
          return 0;
        }
        const newWebGroup = webGroupSelect.filter((obj) => obj.object.id_grupo !== webGroupObjectSelect.id_grupo);
        console.log(newWebGroup);
        setWebGroupSelect(newWebGroup);
        clear()
        show_ok('Eliminar', 'Eliminación exitosa')
      }
    })
  }

  const show_modal_insert = async function (e) {
    Swal.fire({
      title: 'Registrar',
      text: 'Verifica los datos ingresados',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        const postrequest = JSON.stringify([{
          database: 'D_EWAYA_CONFIG',
          table: 'GD_WebGrupo',
          main_id: 'id_grupo',
          body: JSON.stringify({
            name: reportName.value,
            description: reportDescription,
            id_tipogrupo: 1
          })
        }])
        console.log("postrequest")
        console.log(postrequest)
        const response_insert_webgrupo = await request_insertrow(
          JSON.stringify([{
            database: 'D_EWAYA_CONFIG',
            table: 'GD_WebGrupo',
            main_id: 'id_grupo',
            body: JSON.stringify({
              name: reportName.value,
              description: reportDescription,
              id_tipogrupo: 1
            })
          }])
        )
        const json_insert_webgrupo = await response_insert_webgrupo.json()
        if (!response_insert_webgrupo.ok) {
          show_error()
          return 0;
        }
        console.log(viewQuery)
        console.log(viewQuery.replaceAll("'", "''"))
        const response_insert_webreporte = await request_insertrow(
          JSON.stringify([{
            database: 'D_EWAYA_CONFIG',
            table: 'GD_WebReporte',
            main_id: 'id_reporte',
            body: JSON.stringify({
              desc_qry: viewName,
              full_qry: viewQuery.replaceAll("'", "''"),
              id_tiporeporte: 2
            })
          }])
        )
        const json_insert_webreporte = await response_insert_webreporte.json()
        if (!response_insert_webreporte.ok) {
          show_error()
          return 0;
        }
        const response_insert_webgruporeporte = await request_insertrow(
          JSON.stringify([{
            database: 'D_EWAYA_CONFIG',
            table: 'GD_WebGrupoReporte',
            body: JSON.stringify({
              id_grupo: json_insert_webgrupo['id_grupo'],
              id_reporte: json_insert_webreporte['id_reporte'],
              description: viewName
            })
          }])
        )

        if (!response_insert_webgruporeporte.ok) {
          show_error()
          return 0;
        }
        clear()
        showTables()
        show_ok('Registrar', 'Registro exitoso')
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
            table: 'GD_WebGrupo',
            where: JSON.stringify({
              id_grupo: webGroupObjectSelect.id_grupo
            }),
            body: JSON.stringify({
              name: webGroupObjectSelect.name,
              description: reportDescription
            })
          })
        )
        if (!response_update_webgrupo.ok) {
          show_error()
          return 0;
        }
        const response_update_webreporte = await request_updaterow(
          JSON.stringify({
            database: 'D_EWAYA_CONFIG',
            table: 'GD_WebReporte',
            where: JSON.stringify({
              id_reporte: listView[0].id_reporte
            }),
            body: JSON.stringify({
              desc_qry: viewName,
              full_qry: viewQuery.replaceAll("'", "''")
            })
          })
        )
        if (!response_update_webreporte.ok) {
          show_error()
          return 0;
        }

        const response_update_webgruporeporte = await request_updaterow(
          JSON.stringify({
            database: 'D_EWAYA_CONFIG',
            table: 'GD_WebGrupoReporte',
            where: JSON.stringify({
              id_grupo: webGroupObjectSelect.id_grupo,
              id_reporte: listView[0].id_reporte
            }),
            body: JSON.stringify({ description: viewName })
          })
        )
        if (!response_update_webgruporeporte.ok) {
          show_error()
          return 0;
        }

        const response_delete_webreportegrafico = await request_deleterow(
          JSON.stringify({
            database: 'D_EWAYA_CONFIG',
            table: 'GD_WebReporteGrafico',
            where: JSON.stringify({
              id_reporte: listView[0].id_reporte
            })
          })
        )
        if (!response_delete_webreportegrafico.ok) {
          show_error()
          return 0;
        }
        
        var listInsert = []
        listChart.map(function (obj) {
          console.log(listChart)
          var insert = {
            database: 'D_EWAYA_CONFIG',
            table: 'GD_WebReporteGrafico',
            main_id: 'id_reportegrafico',
            body: JSON.stringify({
              id_reporte: listView[0].id_reporte,
              id_grafico: obj['id_grafico'],
              estado: 1,
              titulo: !obj['titulo'] ? "" : obj['titulo'],
              categoria: obj['categoria'],
              valor: obj['valor']
            })
          }
          listInsert.push(insert)
        }
        )
        console.log("===========listInsert===========")
        console.log(listInsert)
        const response_insert_webreportegrafico = await request_insertrow(
          JSON.stringify(listInsert)
        )
        console.log("===========response_insert_webreportegrafico===========")
        console.log(response_insert_webreportegrafico)
          
        /*listChart.map(function (obj) {
          console.log(listChart)
          const response_insert_webreportegrafico = request_insertrow(
            JSON.stringify({
              database: 'D_EWAYA_CONFIG',
              table: 'GD_WebReporteGrafico',
              main_id: 'id_reportegrafico',
              body: JSON.stringify({
                id_reporte: listView[0].id_reporte,
                id_grafico: obj['id_grafico'],
                estado: 1,
                categoria: obj['categoria'],
                valor: obj['valor']
              })
            })
          )*/
          if (!response_insert_webreportegrafico.ok) {
            show_error()
            return 0;
          }
        
        show_ok('Actualizar', 'Actualización exitosa')
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

  const show_ok = (title, text, icon = 'success', button = 'Aceptar') => {
    show_modal(title, text, icon, button)
  }

  const show_error = (title = 'Error', text = 'Ocurrió un error en la operación', icon = 'error', button = 'Aceptar') => {
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

  const request_getquerycolumns = async (body) => {
    const base_url = 'http://localhost:8080'
    //const base_url = 'http://ms-python-teradata-nirvana-qa.apps.ocptest.gp.inet'
    const method = '/getQueryColumns'
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

  const request_deleterow = async (body) => {
    const base_url = 'http://localhost:8080'
    //const base_url = 'http://ms-python-teradata-nirvana-qa.apps.ocptest.gp.inet'
    const method = '/deleteRow'
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

  const showTables = async () => {
    setFlagAction('')
    console.log("showTables")
    try {
      const response_list_webgroup = await request_gettabledata(
        JSON.stringify({
          database: 'D_EWAYA_CONFIG',
          table: 'VW_WebGrupo',
          where: JSON.stringify({ state: 1 })
        })
      )
      const selectWebGroup = [];
      response_list_webgroup.map(function (obj) {
        selectWebGroup.push({ value: obj["name"], label: obj["name"], object: obj });
      })
      setWebGroupSelect(selectWebGroup)

      const response_list_chart = await request_gettabledata(
        JSON.stringify({
          database: 'D_EWAYA_CONFIG',
          table: 'GD_WebGrafico',
          where: JSON.stringify({
            estado: 1
          }),
          order: 1
        })
      )
      const dataSelect = []
      response_list_chart.map(function (obj) {
        dataSelect.push({ value: obj["id_grafico"], label: obj["nombre"], object: obj });
      })
      setChartOptions(dataSelect)
    } catch (error) {
      console.error("There has been a problem with your fetch operation:", error);
    }
  }

  const setWebReport = () => {
    if(listView.length>0){
      setViewName(listView[0].desc_qry)
      setViewQuery(listView[0].full_qry)
    }
  }

  const getKeysFromJson = (obj) => {
    return Object.keys(obj).map(key => key)
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
    setViewName("")
    setViewQuery("")
  }

  useEffect(() => {
    console.log("useEffect showTables")
    setHiddenCRUD(true)
    showTables()
  }, [])

  useEffect(() => {
    setNumChart(listChart.length)
  }, [reportColumns])

  useEffect(() => {
    getQueryColumns()
  }, [viewQuery])

  useEffect(() => {
    console.log("useEffect setWebGroup")
    console.log(webGroupObjectSelect.id_grupo)
    console.log(webGroupValueSelect)
    getReportes()
    //setWebGroup()
    if (flagAction === 'update') {
      setReportDate(webGroupObjectSelect.create_ts)
    } else {
      setReportDate(new Date().toLocaleString().replace(",", ""))
    }
    //setWebReport()
  }, [webGroupValueSelect])

  useEffect(() => {
    console.log("useEffect setWebReport")
    setWebReport()
  }, [listView])

  useEffect(() => {
    console.log("useEffect showFormCRUD")
    showFormCRUD()
  }, [enableCRUD])

  const style = {
    control: base => ({
      ...base,
      borderColor: '#06f'
    })
  };



  return (
    <div className="App">
      <div className="App-title">
        <h2 align="center" className="display-8 fw-bold main-title">Mantenimiento de Tablero BI</h2>
        </div>
        {/*<div className="col-sm-3">
                      <Button color="primary"
                        onClick={(e) => test(e)}>Test</Button>
  </div>*/} 
      <div className='modalRight modalBody'>
      <div class="d-flex justify-content-center bd-highlight mb-3">
        <div className={`divPassword col-sm-3 ${(!hiddenCRUD ? "div-hidden" : "")}`} >
          <input id="inputEnableCRUD" type='text' className="form-control input"
            value={enableCRUD} onInput={e => setEnableCRUD(e.target.value)}></input>
        </div>
        </div>
        <div className={`content ${(hiddenCRUD ? "div-hidden" : "")}`}>
          <form>
            <div className="divReport">
              <div className="divReportName mb-3 row">
                <label htmlFor="reportName" className="col-sm-1 col-form-label labelForm">Nombre</label>
                <div className="col-sm-3">
                  <CreatableSelect
                    styles={style}
                    options={webGroupSelect}
                    value={reportName}
                    onCreateOption={handleCreateReport}
                    onChange={webGroupHandler} />
                </div>
                
                <div className="col-sm-1">
                  <label className="col-form-label labelForm">Fecha mod:</label>
                </div>
                <div className="col-sm-2">
                  <label className="date-update col-form-label labelForm">{reportDate}</label>
                </div>
              </div>
              <div className="divReportDescription mb-3 row">
                <label htmlFor="reportDescription" className="col-sm-1 col-form-label labelForm">Descripcion</label>
                <div className="col-sm-3">
                  <input id="reportDescription" type='text' className="form-control input"
                    value={reportDescription} onInput={e => setReportDescription(e.target.value)}></input>
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
                    <legend className="w-auto px-4 title-viewform">Detalle</legend >
                  </div>
                  <div className="divViewName mb-3 row">
                    <label htmlFor="viewName" className="col-sm-1 px-4 col-form-label labelForm">Nombre</label>
                    <div className="col-sm-3">
                      <input id="viewName" type='text' className="form-control input"
                        value={viewName} onInput={e => setViewName(e.target.value)}></input>
                    </div>
                  </div>
                  <div className={`divViewQuery mb-3 row`}>
                    <label htmlFor="viewQuery" className="col-sm-1 px-4 col-form-label labelForm">Query</label>
                    <div className="col-sm-5">
                      <textarea id="viewQuery" type='text' className="form-control" rows="6"
                        value={viewQuery} onInput={e => setViewQuery(e.target.value)}></textarea>
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
                      <Button color="danger" className={`${(flagAction === 'update' ? '' : 'div-hidden')}`}
                        onClick={(e) => deleteButton(e)}>Eliminar</Button>
                    </div>
                  </div>
                  {[...Array(numChart)].map((e, i) => {
                    return getChartForm(e, i)
                  })}
                  <div className="mb-3 row">

                    <div className="col-sm-3">
                      <Button color="primary" className={`${(flagAction === 'update' ? '' : 'div-hidden')}`}
                        onClick={(e) => addChart(e)}>Agregar Grafico</Button>
                    </div>
                  </div>

                </div>
              </fieldset>
            </form>
          </form>
        </div>
      </div>
    </div>

  );
}

export default Mantenimiento;