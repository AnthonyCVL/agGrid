import './Mantenimiento.css';
import React, { useState, useEffect, useRef } from 'react';
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
  const [reportSchedule, setReportSchedule] = useState("")
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

  const [categorySelect, setCategorySelect] = useState([])
  const [categoryValueSelect, setCategoryValueSelect] = useState({})
  const [categoryObjectSelect, setCategoryObjectSelect] = useState({})
  const [categoryName, setCategoryName] = useState("")
  const [filterCategorySelect, setFilterCategorySelect] = useState([])
  const [filterCategoryValueSelect, setFilterCategoryValueSelect] = useState({})
  const [filterCategoryObjectSelect, setFilterCategoryObjectSelect] = useState({})

  {/* ------------PROBANDO*---------*/}
  const [dataBaseSelect,setdataBaseSelect] = useState([])
  const [dataBaseValueSelect,setdataBaseValueSelect] =  useState({})
  const [dataBaseObjectSelect, setdataBaseObjectSelect] = useState({})
  const [dataBaseName, setdataBaseName] = useState("")
  const [filterdataBaseSelect, setFilterdataBaseSelect] = useState([]) ///No se necesita, pues es usando en el buscar
  const [filterdataBaseValueSelect, setFilterdataBaseValueSelect] = useState({}) ///No se necesita, pues es usando en el buscar
  const [filterdataBaseObjectSelect, setFilterdataBaseObjectSelect] = useState({})
  {/* ------------PROBANDO*---------*/}

  const [listChart, setListChart] = useState([])

  const createOption = (label) => ({
    label,
    value: label
  });

  const cargarArchivo = () => {
    const archivoInput = document.getElementById('archivoInput');
    archivoInput.click();

    archivoInput.addEventListener('change', () => {
        const archivo = archivoInput.files[0];
        const lector = new FileReader();

        lector.onload = (evento) => {
            const contenido = evento.target.result;
            console.log("Contenido del archivo:", contenido);

        };

        lector.readAsText(archivo);
    });
}

  const handleCreateReport = (inputValue) => {
    console.log("INSERT")
    clear()
    const newOption = createOption(inputValue);
    //setWebGroupSelect((prev) => [...prev, newOption]);
    setReportName(newOption);
    setReportDescription('')
    setFlagAction('insert')

    setCategoryValueSelect(categorySelect.filter(function(p){return p.value == 1}))

    setdataBaseValueSelect(dataBaseSelect.filter(function(p){return p.value == 1}))

    console.log(flagAction)
  };

  const webGroupHandler = function (e) {
    console.log("UPDATE")
    clear()
    console.log("webGroupHandler")
    console.log(e)
    setWebGroupObjectSelect(e.object)
    setWebGroupValueSelect(e)
    setCategoryValueSelect(categorySelect.filter(function(p){return p.value == e.object.id_categoria}))

    setReportDescription(e.object.name)
    setReportName(createOption(e.object.name))
    setReportDate(webGroupObjectSelect.create_ts)
    setReportSchedule(e.object.schedule)
    setFlagAction('update')
    setReportColumns([])
    setListChart([])
    setNumChart(0)
  }

  const handlerFilterCategory = function (e) {
    setFilterCategoryObjectSelect(e.object)
    setFilterCategoryValueSelect(e)
  }

  const handlerCategory = function (e) {
    setCategoryObjectSelect(e.object)
    setCategoryValueSelect(e)
  }

  const handlerdataBase = function (e) {
    setdataBaseObjectSelect(e.object)
    setdataBaseValueSelect(e)
  }

  const showFormCRUD = function (e) {
    console.log("showFormCRUD")
    if (enableCRUD === "Rv%#2mEpU687") {
      setHiddenCRUD(false)
    }
  }
  
  const showReportes = async () =>{
    try {
      console.log('showReportes')
      console.log(filterCategoryValueSelect)
      var filter = {state: 1}
      if (filterCategoryValueSelect.value > 0 && filterCategoryValueSelect.value !== undefined) {
        filter.id_categoria = filterCategoryValueSelect.value
      }
      
      const response_webgroup = await request_getquerydata(
        JSON.stringify({
          database: 'D_EWAYA_CONFIG',
          table: 'VW_WebGrupo',
          where: JSON.stringify(filter)
        })
      )
      const list_webgroup = response_webgroup.result
      const selectWebGroup = [];
      list_webgroup.sort(function (a, b) {
        return a.id_grupo - b.id_grupo || a.name.localeCompare(b.name);
      });
      list_webgroup.map(function (obj) {
        selectWebGroup.push({ value: obj["name"], label: obj["name"], object: obj });
      }) 
      console.log("selectWebGroup")
      console.log(selectWebGroup)
      setWebGroupSelect(selectWebGroup)
    } catch (error) {
      console.error("There has been a problem with your fetch operation:", error);
    }
  }

  const getReportes = async function (e) {
    console.log("getReportes")
    console.log(webGroupObjectSelect.id_grupo)
    setListView([])
    if (webGroupObjectSelect === "" || webGroupObjectSelect === undefined || webGroupObjectSelect.id_grupo === '' || webGroupObjectSelect.id_grupo === undefined) {
      return 0
    }
    const response_webgroupreport = await request_getquerydata(
      JSON.stringify({
        database: 'D_EWAYA_CONFIG',
        table: 'VW_WebGrupoReporte',
        where: JSON.stringify({ id_grupo: webGroupObjectSelect.id_grupo })
      })
    )

    const webgroupreport = response_webgroupreport.result
    webgroupreport.map(async function (obj) {
      const response_webreport = await request_getquerydata(
        JSON.stringify({
          database: 'D_EWAYA_CONFIG',
          table: 'GD_WebReporte',
          where: JSON.stringify({ id_reporte: obj.id_reporte })
        }))
      const webreport = response_webreport.result
      console.log(webreport)
      if (webreport.length > 0) {
        setListView(listView => [...listView, webreport[0]])
      }
      console.log("GD_WebReporteGrafico")
      console.log(obj.id_reporte)
      const response_webreportegrafico = await request_getquerydata(
        JSON.stringify({
          database: 'D_EWAYA_CONFIG',
          table: 'GD_WebReporteGrafico',
          where: JSON.stringify({ id_reporte: obj.id_reporte })
        }))
      const webreportegrafico = response_webreportegrafico.result
      console.log("POST QUERY")
      console.log("response: "+webreportegrafico)
      console.log(webreportegrafico)
      if (webreportegrafico.length > 0) {
        console.log("iffffff")
        var list = []
        webreportegrafico.map(function (obj) {
          list.push({ id_grafico: obj["id_grafico"], categoria: obj["categoria"], valor: obj["valor"], titulo: obj["titulo"], limite: obj["limite"],id_database: obj["id_database"], object: obj });
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
    console.log(reportColumns)
    console.log(viewQuery)
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
                    {/* ------------PROBANDO*---------*/}
                  <div className="col-sm-2">
                    <Select styles={style} 
                            options={reportColumns}
                            value={getElementByValue(reportColumns,listChart[i]['id_database'])}
                            defaultValue={reportColumns[0]}
                            onChange={onChangeChartSelect(listChart,i,'id_database')}/>
                  </div>
                    {/* ------------PROBANDO*---------*/}


                  
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
                    <input  type='number' className="form-control input" placeholder="limite"
                              value={listChart[i]['limite']}
                              onInput={onChangeChartInput(listChart,i,'limite')}
                              min="0"
                              onKeyPress={(event) => {
                                if (!/[0-9]/.test(event.key)) {
                                  event.preventDefault();
                                }
                              }}></input>
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
    console.log("show_modal_insert")
    console.log(dataBaseValueSelect.value)
    Swal.fire({
      title: 'Registrar',
      text: 'Verifica los datos ingresados',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        const p_query = viewQuery.replaceAll("'", "''");
        /*const validate_query = await request_gettabledata(
          JSON.stringify({
            query: p_query,
            type: 2
          })
        )
        const json_validate_query = await validate_query.json()
        console.log("show_modal_inserttttttttttttttttttt")
        console.log(json_validate_query)
        if (!json_validate_query.ok) {
          show_error()
          return 0;
        }*/
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
        //console.log("postrequest")
        //console.log(postrequest)
        const response_insert_webgrupo = await request_insertrow(
          JSON.stringify([{
            database: 'D_EWAYA_CONFIG',
            table: 'GD_WebGrupo',
            main_id: 'id_grupo',
            body: JSON.stringify({
              name: reportName.value,
              description: reportName.value,
              id_tipogrupo: 1,
              id_categoria: categoryValueSelect.value,
              schedule: reportSchedule
            })
          }])
        )
        const json_insert_webgrupo = await response_insert_webgrupo.json()
        if (!response_insert_webgrupo.ok) {
          show_error()
          return 0;
        }
        //console.log(viewQuery)
        //console.log(p_query)
        debugger;

        var dataBaseValueSelect_aux;
        if (dataBaseValueSelect.hasOwnProperty('value')) {
            dataBaseValueSelect_aux = dataBaseValueSelect.value;
        } else {
            dataBaseValueSelect_aux = dataBaseValueSelect[0].value;
        }

        const response_insert_webreporte = await request_insertrow(
          JSON.stringify([{
            database: 'D_EWAYA_CONFIG',
            table: 'GD_WebReporte',
            main_id: 'id_reporte',
            body: JSON.stringify({
              desc_qry: viewName,
              full_qry: p_query,
              id_tiporeporte: 2,
              id_database: dataBaseValueSelect_aux
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
    console.log("show_modal_update")
    console.log(dataBaseValueSelect.value)
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
              name: reportDescription,
              description: reportDescription,
              id_categoria: categoryValueSelect.value,
              schedule: reportSchedule
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
              full_qry: viewQuery.replaceAll("'", "''"), 
              id_database: dataBaseValueSelect.value
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
              valor: obj['valor'],
              limite: obj['limite'],
              id_database: obj['id_database']
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
        
        showTables('update', reportDescription)
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

  const request_getquerydata = async (body) => {
    //const base_url = 'http://localhost:8080'
    const base_url = 'http://ms-python-teradata-nirvana-qa.apps.ocptest.gp.inet'
    const method = '/getQueryData'
    const request = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: body
    };
    return await send_post(base_url, method, request)
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
    //const base_url = 'http://localhost:8080'
    const base_url = 'http://ms-python-teradata-nirvana-qa.apps.ocptest.gp.inet'
    const method = '/getQueryColumns'
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

  const request_deleterow = async (body) => {
    //const base_url = 'http://localhost:8080'
    const base_url = 'http://ms-python-teradata-nirvana-qa.apps.ocptest.gp.inet'
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

  const showTables = async (action='', reportName='') => {
    console.log(action)
    setFlagAction(action)
    console.log("showTables")
    
    try {
      const response_category = await request_getquerydata(
        JSON.stringify({
          database: 'D_EWAYA_CONFIG',
          table: 'VW_WebReporteCategoria',
          where: JSON.stringify({ state: 1 })
        })
      )
      const category = response_category.result
      const arr_category = [];
      category.sort(function (a, b) {
        return a.id_categoria - b.id_categoria || a.desc_categoria.localeCompare(b.desc_categoria);
      });
      category.map(function (obj) {
        arr_category.push({ value: obj["id_categoria"], label: obj["desc_categoria"], object: obj });
      })
      setCategorySelect(arr_category)
      const category_all = { value: 0, label: "Todos"}
      setFilterCategorySelect([category_all, ...arr_category])
      setFilterCategoryValueSelect(category_all)

      const response_webgroup = await request_getquerydata(
        JSON.stringify({
          database: 'D_EWAYA_CONFIG',
          table: 'VW_WebGrupo',
          where: JSON.stringify({ state: 1 })
        })
      )
      const list_webgroup = response_webgroup.result
      const selectWebGroup = [];
      list_webgroup.map(function (obj) {
        selectWebGroup.push({ value: obj["name"], label: obj["name"], object: obj });
      })
      setWebGroupSelect(selectWebGroup)
      if(reportName!==''){
        setReportName(createOption(reportName))
      }

      const response_list_chart = await request_getquerydata(
        JSON.stringify({
          database: 'D_EWAYA_CONFIG',
          table: 'GD_WebGrafico',
          where: JSON.stringify({
            estado: 1
          }),
          order: 1
        })
      )
      const list_chart = response_list_chart.result 
      const dataSelect = []
      list_chart.map(function (obj) {
        dataSelect.push({ value: obj["id_grafico"], label: obj["nombre"], id_dataBase: obj['id_database'], object: obj });
      })
      setChartOptions(dataSelect)
      {/*PRUEBA*/}

      const response_dataBase =  await  request_getquerydata(
          JSON.stringify({
            database:'D_EWAYA_CONFIG',
            table: 'GD_WebDatabaseEngine'
          })    
      )
      const dataBase = response_dataBase.result
      const arr_dataBase = [];
      dataBase.sort(function (a, b) {
        return a.id_database - b.id_database  || a.database_name.localeCompare(b.database_name);
      });
      dataBase.map(function (obj){
        arr_dataBase.push({ value:  obj["id_database"], label:  obj["database_name"], object: obj });    
      })
      console.log(arr_dataBase)
      console.log(action)
      setdataBaseSelect(arr_dataBase)
      const dataBase_all = {value: 0, label: "Todos"}
      setFilterdataBaseSelect([dataBase_all, ...arr_dataBase])
      setFilterdataBaseValueSelect(dataBase_all)
      

    } catch (error) {
      console.error("There has been a problem with your fetch operation:", error);
    }
  }

  const setWebReport = () => {
    console.log("setWebReport")
    console.log(listView)
    

    if(listView.length > 0){
      setViewName(listView[0].desc_qry)
      setViewQuery(listView[0].full_qry)

      var result = dataBaseSelect.filter(function(p){
        return p.value == listView[0].id_database
      })
      console.log(result)
      if(result.length > 0){
        setdataBaseValueSelect(result[0])
        setdataBaseObjectSelect(result[0].object)
      }
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
    setCategoryObjectSelect([])
    setCategoryValueSelect([])

    setdataBaseObjectSelect([])
    setdataBaseValueSelect([])

    //setWebGroupSelect([])
    console.log(webGroupObjectSelect.id_grupo)
    setReportName("")
    setReportDescription("")
    setViewName("")
    setViewQuery("")
    setListChart([])
  }

  useEffect(() => {
    console.log("useEffect showTables")
    setHiddenCRUD(true)
    showTables()
  }, [])

  useEffect(() => {
    //console.log('setting numchart')
    //console.log(listChart.length)
    //setNumChart(listChart.length)
  }, [reportColumns])

  useEffect(() => {
    showReportes()
  }, [filterCategoryValueSelect])

  const previousValues = useRef({ listChart, reportColumns });

  useEffect(() => {
    if (
      previousValues.current.listChart.length !== listChart.length &&
      previousValues.current.reportColumns.length !== reportColumns.length
    ) {
    setNumChart(listChart.length)
      previousValues.current = { listChart, reportColumns };
    }
  });

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
                <label className="col-sm-1 col-form-label labelForm">Buscar Categoria</label>
                <div className="col-sm-3">
                <Select
                  styles={style}
                  options={filterCategorySelect}
                  value={filterCategoryValueSelect}
                  onChange={(e) => handlerFilterCategory(e)}
                />
                </div>
              </div>
              <hr/>

              <div className="divReportName mb-3 row"> 
                <div className="col-sm-1 div-left">
                  <label htmlFor="reportName" className="col-form-label labelForm">Seleccionar Reporte:</label>
                </div>
                <div className="col-sm-3">
                  <CreatableSelect
                    styles={style}
                    options={webGroupSelect}
                    value={reportName}
                    onCreateOption={handleCreateReport}
                    onChange={webGroupHandler} />
                </div>
                
                <div className="col-sm-1 div-left">
                  <label className="col-form-label labelForm">Fecha mod:</label>
                </div>
                <div className="col-sm-2 div-left">
                  <label className="date-update col-form-label labelForm">{reportDate}</label>
                </div>

                <div className="col-sm-1 div-left">
                  <label htmlFor="reportSchedule" className='col-form-label labelForm'>Schedule:</label>
                </div>
                <div className="col-sm-2 div-left">
                  <input id="reportSchedule" type='text' className='form-control input'
                    value={reportSchedule} onInput={e => setReportSchedule(e.target.value)}></input>
                </div>
              </div>


              <div className="divReportDescription mb-3 row">
                <div className="col-sm-1 div-left">
                  <label htmlFor="reportDescription" className='col-form-label labelForm'>Nombre:</label>
                </div>
                <div className="col-sm-3 div-left">
                  <input id="reportDescription" type='text' className='form-control input'
                    value={reportDescription} onInput={e => setReportDescription(e.target.value)} disabled={`${(flagAction === 'insert' ? 'true' : '')}`} ></input>
                </div>
                <div className="col-sm-1 div-left">
                  <label className="col-form-label labelForm">Categoria:</label>
                </div>  
                <div className="col-sm-2">
                <Select
                  styles={style}
                  options={categorySelect}
                  value={categoryValueSelect}
                  onChange={(e) => handlerCategory(e)}
                />
                </div>
              {/*PROBANDO 04/03/2023 */}
              <div className="col-sm-1 div-left">
                  <label className="col-form-label labelForm">Importar:</label>
                </div>  
                <div className="col-sm-2" id="archivoInput" >
                <Button  color="primary" onClick={() => cargarArchivo()}>
                  Importación
                </Button>
                
                </div>


              {/*<div className="divDatatable">
                  <label htmlFor="reportDatatable">Datatable</label>
                  <AgGrid
                    p_grouptables={p_grouptables}
                    p_datatables={p_datatables} />
    </div>*/}
            </div>
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
                    <div className="col-sm-1 div-left">
                  <label className='col-form-label labelForm'>Base de datos:</label>
                </div>
                <div  className="col-sm-2">
                  {/* probando */}
                <Select
                   styles = {style}
                   options = {dataBaseSelect}
                   value = {dataBaseValueSelect}
                   onChange={(e) => handlerdataBase(e)}

                />
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
                    console.log(e)
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