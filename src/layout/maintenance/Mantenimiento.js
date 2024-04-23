import './Mantenimiento.css';
import React, {useEffect, useRef, useState} from 'react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import {Button} from 'reactstrap'
import Swal from 'sweetalert2'
import ApiService from "../../services/apiServices";

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
  const [numChart, setNumChart] = useState(0)
  const [reportColumns, setReportColumns] = useState([])

  const [categorySelect, setCategorySelect] = useState([])
  const [categoryValueSelect, setCategoryValueSelect] = useState({})
  const [, setCategoryObjectSelect] = useState({})
  const [filterCategorySelect, setFilterCategorySelect] = useState([])
  const [filterCategoryValueSelect, setFilterCategoryValueSelect] = useState({})
  const [, setFilterCategoryObjectSelect] = useState({})

  // eslint-disable-next-line no-lone-blocks
  {/* ------------PROBANDO*---------*/}
  const [dataBaseSelect,setdataBaseSelect] = useState([])
  const [dataBaseValueSelect,setdataBaseValueSelect] =  useState({})
  const [, setdataBaseObjectSelect] = useState({})
  const [, setFilterdataBaseSelect] = useState([]) ///No se necesita, pues es usando en el buscar
  const [, setFilterdataBaseValueSelect] = useState({}) ///No se necesita, pues es usando en el buscar
  // eslint-disable-next-line no-lone-blocks
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
    clear()
    const newOption = createOption(inputValue);
    setReportName(newOption);
    setReportDescription('')
    setFlagAction('insert')
    setCategoryValueSelect(categorySelect.filter(function(p){return p.value === 1}))
    setdataBaseValueSelect(dataBaseSelect.filter(function(p){return p.value === 1}))
  };

  const webGroupHandler = function (e) {
    clear()
    setWebGroupObjectSelect(e.object)
    setWebGroupValueSelect(e)
    setCategoryValueSelect(categorySelect.filter(function(p){return p.value === e.object.id_categoria}))
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
    if (enableCRUD === "Rv%#2mEpU687") {
      setHiddenCRUD(false)
    }
  }
  
  const showReportes = async () =>{
    try {
      var filter = {state: 1}
      if (filterCategoryValueSelect.value > 0 && filterCategoryValueSelect.value !== undefined) {
        filter.id_categoria = filterCategoryValueSelect.value
      }
      const response_webgroup = await ApiService.request_getquerydata(
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
      // eslint-disable-next-line array-callback-return
      list_webgroup.map(function (obj) {
        selectWebGroup.push({ value: obj["name"], label: obj["name"], object: obj });
      }) 
      setWebGroupSelect(selectWebGroup)
    } catch (error) {
      console.error("There has been a problem with your fetch operation:", error);
    }
  }

  const getReportes = async function (e) {
    setListView([])
    if (webGroupObjectSelect === "" || webGroupObjectSelect === undefined || webGroupObjectSelect.id_grupo === '' || webGroupObjectSelect.id_grupo === undefined) {
      return 0
    }
    const response_webgroupreport = await ApiService.request_getquerydata(
      JSON.stringify({
        database: 'D_EWAYA_CONFIG',
        table: 'VW_WebGrupoReporte',
        where: JSON.stringify({ id_grupo: webGroupObjectSelect.id_grupo })
      })
    )
    const webgroupreport = response_webgroupreport.result
    webgroupreport.map(async function (obj) {
      const response_webreport = await ApiService.request_getquerydata(
        JSON.stringify({
          database: 'D_EWAYA_CONFIG',
          table: 'GD_WebReporte',
          where: JSON.stringify({ id_reporte: obj.id_reporte })
        }))
      const webreport = response_webreport.result
      if (webreport.length > 0) {
        setListView(listView => [...listView, webreport[0]])
      }
      const response_webreportegrafico = await ApiService.request_getquerydata(
        JSON.stringify({
          database: 'D_EWAYA_CONFIG',
          table: 'GD_WebReporteGrafico',
          where: JSON.stringify({ id_reporte: obj.id_reporte })
        }))
      const webreportegrafico = response_webreportegrafico.result
      if (webreportegrafico.length > 0) {
        var list = []
        // eslint-disable-next-line array-callback-return
        webreportegrafico.map(function (obj) {
          list.push({ id_grafico: obj["id_grafico"], categoria: obj["categoria"], valor: obj["valor"], titulo: obj["titulo"], limite: obj["limite"],id_database: obj["id_database"], object: obj });
        })
        setListChart(list)
      }
    })
     
  }


  const saveButton = async function (e) {
    if (flagAction === 'insert') {
      show_modal_insert()
    } else {
      show_modal_update()
    }
  }

  const deleteButton = async function (e) {
    if (flagAction === 'update') {
      show_modal_delete()
    }
  }

  const getQueryColumns = async function(e){
    if(reportColumns.length===0 && viewQuery!==null && viewQuery!==""){
      const result_columns = await ApiService.request_getquerycolumns(
        JSON.stringify({
          query: viewQuery
        })
      )
      var columns = Object.keys(result_columns[0]).map(obj => {
        return ({value: obj, label: obj})
      })
      var elementContar = {value: "contar", label: "contar"}
      columns.unshift(elementContar)
      setReportColumns(columns)
    }
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
    setNumChart(numChart-1)
    listChart.splice(i, 1)
  }

  const getElementByValue = (list, value) => {
    return list.filter(el => el.value === value)
  }

  const getChartForm = function (e, i) {
    if(listChart.length===0){
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
    Swal.fire({
      title: 'Eliminar',
      text: '¿Está seguro de eliminar este registro?',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        const response_update_webgrupo = await ApiService.request_updaterow(
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
        const p_query = viewQuery.replaceAll("'", "''");
        const response_insert_webgrupo = await ApiService.request_insertrow(
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
        debugger;

        var dataBaseValueSelect_aux;
        if (dataBaseValueSelect.hasOwnProperty('value')) {
            dataBaseValueSelect_aux = dataBaseValueSelect.value;
        } else {
            dataBaseValueSelect_aux = dataBaseValueSelect[0].value;
        }

        const response_insert_webreporte = await ApiService.request_insertrow(
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
        const response_insert_webgruporeporte = await ApiService.request_insertrow(
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
        const response_update_webgrupo = await ApiService.request_updaterow(
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
        const response_update_webreporte = await ApiService.request_updaterow(
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

        const response_update_webgruporeporte = await ApiService.request_updaterow(
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

        const response_delete_webreportegrafico = await ApiService.request_deleterow(
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
        // eslint-disable-next-line array-callback-return
        listChart.map(function (obj) {
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
        const response_insert_webreportegrafico = await ApiService.request_insertrow(
          JSON.stringify(listInsert)
        )
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

  const showTables = async (action='', reportName='') => {
    setFlagAction(action)
    try {
      const response_category = await ApiService.request_getquerydata(
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
      // eslint-disable-next-line array-callback-return
      category.map(function (obj) {
        arr_category.push({ value: obj["id_categoria"], label: obj["desc_categoria"], object: obj });
      })
      setCategorySelect(arr_category)
      const category_all = { value: 0, label: "Todos"}
      setFilterCategorySelect([category_all, ...arr_category])
      setFilterCategoryValueSelect(category_all)

      const response_webgroup = await ApiService.request_getquerydata(
        JSON.stringify({
          database: 'D_EWAYA_CONFIG',
          table: 'VW_WebGrupo',
          where: JSON.stringify({ state: 1 })
        })
      )
      const list_webgroup = response_webgroup.result
      const selectWebGroup = [];
      // eslint-disable-next-line array-callback-return
      list_webgroup.map(function (obj) {
        selectWebGroup.push({ value: obj["name"], label: obj["name"], object: obj });
      })
      setWebGroupSelect(selectWebGroup)
      if(reportName!==''){
        setReportName(createOption(reportName))
      }

      const response_list_chart = await ApiService.request_getquerydata(
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
      // eslint-disable-next-line array-callback-return
      list_chart.map(function (obj) {
        dataSelect.push({ value: obj["id_grafico"], label: obj["nombre"], id_dataBase: obj['id_database'], object: obj });
      })
      setChartOptions(dataSelect)
      const response_dataBase =  await ApiService.request_getquerydata(
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
      // eslint-disable-next-line array-callback-return
      dataBase.map(function (obj){
        arr_dataBase.push({ value:  obj["id_database"], label:  obj["database_name"], object: obj });    
      })
      setdataBaseSelect(arr_dataBase)
      const dataBase_all = {value: 0, label: "Todos"}
      setFilterdataBaseSelect([dataBase_all, ...arr_dataBase])
      setFilterdataBaseValueSelect(dataBase_all)
      

    } catch (error) {
      console.error("There has been a problem with your fetch operation:", error);
    }
  }

  const setWebReport = () => {
    if(listView.length > 0){
      setViewName(listView[0].desc_qry)
      setViewQuery(listView[0].full_qry)

      var result = dataBaseSelect.filter(function(p){
        return p.value === listView[0].id_database
      })
      if(result.length > 0){
        setdataBaseValueSelect(result[0])
        setdataBaseObjectSelect(result[0].object)
      }
    }
  }

  const clear = () => {
    setWebGroupObjectSelect([])
    setWebGroupValueSelect({})
    setCategoryObjectSelect([])
    setCategoryValueSelect([])
    setdataBaseObjectSelect([])
    setdataBaseValueSelect([])
    setReportName("")
    setReportDescription("")
    setViewName("")
    setViewQuery("")
    setListChart([])
  }

  useEffect(() => {
    setHiddenCRUD(true)
    showTables()
  }, [])

  useEffect(() => {
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
    getReportes()
    if (flagAction === 'update') {
      setReportDate(webGroupObjectSelect.create_ts)
    } else {
      setReportDate(new Date().toLocaleString().replace(",", ""))
    }
  }, [webGroupValueSelect])

  useEffect(() => {
    setWebReport()
  }, [listView])

  useEffect(() => {
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
      <div className='modalRight modalBody'>
      <div className="d-flex justify-content-center bd-highlight mb-3">
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
              <div className="col-sm-1 div-left div-hidden">
                  <label className="col-form-label labelForm">Importar:</label>
              </div>  
              <div className="col-sm-2 div-hidden" id="archivoInput" >
                <Button  color="primary" onClick={() => cargarArchivo()}>
                  Importación
                </Button>
              </div>
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