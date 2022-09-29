import './Metadatos.css';
import React, { useState, useEffect , useRef} from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import Select from 'react-select';
import Navbarr from './Navbarr';

function Metadatos() {
  const headerGrid = useRef(null);
  const detailGrid = useRef(null);
  const [rowsHeader, setRowsHeader] = useState([])
  const [columnsHeader, setColumnsHeader] = useState([])
  const [rowsDetail, setRowsDetail] = useState([])
  const [groupTables, setGroupTables] = useState([])
  const [columnsDetail, setColumnsDetail] = useState([])
  const [rowsTable, setRowTables] = useState([])
  const [rowsTableSelect, setRowTablesSelect] = useState([])
  const [valueSelect, setValueSelect] = useState({})
  const [tableSelected, setTableSelected] = useState([])
  const [datatables, setDatatables] = useState([]);
  const [datatablesColumns, setDatatablesColumns] = useState([])
  const [defaultOption, setDefaultOption] = useState(0);
  const [activeTab, setActiveTab] = useState("1")

  const options = [
    {value: 'Mexico', label: 'Mexico'},
    {value: 'Canada', label: 'Canada'}
  ]

  const addDatatable = async (dt) => {
    setDatatables([...datatables, dt])
  }

  const addElementToArray = async (list, element) => {
    list.push(element)
  }

  const changeTab = (numberTab) => {
    if(activeTab !== numberTab){
      setActiveTab(numberTab)
      setRowsDetail(datatables[numberTab-1])
      setColumnsDetail(datatablesColumns[numberTab-1])
    }
  }

  var moment = require('moment')
  let myDate;

  myDate = moment().format("YYYY-MMMM-dddd")

  const rowData = [
    { make: "Toyota", model: "Celica", price: 35000, date: "09-02-2022", available: true },
    { make: "Ford", model: "Mondeo", price: 32000, date: "11-02-2022", available: false },
    { make: "Porsche", model: "Boxter", price: 72000, date: "10-02-2022", available: true },
    { make: "Mers", model: "Mers", price: 92000, date: "12-02-2022", available: true }
  ];

  const handlerTable = function (e) {
    setTableSelected(e.object)
    setValueSelect(e)
  }

  const columnDefs = (key) => ({
      field: key,
      hide: key.toLowerCase()==='v_obsv',
      //tooltipComponent: customToolTip,
      cellStyle: params => { 
        let style = {};
        if(isNaN(params.value)){
          style['text-align'] = 'left'
        } else {
          style['text-align'] = 'right'
        }
        //Para todas las celdas valida que el campo v_obsv exista y su contenido sea diferente de null
        if('v_obsv' in params.data && params.data.v_obsv !== null && params.data.v_obsv !== "" ){
          //Valida que el contenido de v_obsv sea un String
          if(typeof params.data.v_obsv === 'string' || params.data.v_obsv instanceof String){
            //Transforma el JSON en String en un objeto JSON
            params.data.v_obsv = JSON.parse(params.data.v_obsv)
          }
          //Recorre el JSON contenido en v_obsv
          Object.keys(params.data.v_obsv).map(kjson => {
            //Valida que el cellStyle se aplique sobre el campo contenido en cada elemento del JSON de v_obsv
            //Valida que el JSON sea diferente de null
            if(( kjson.toLowerCase() === params.colDef.field.toLowerCase() || kjson.toLowerCase()=="all_fields") && params.data.v_obsv[kjson]!==null ){
              //Aplica estilos a la celda del elemento del JSON de v_obsv
              Object.keys(params.data.v_obsv[kjson]).map(prop => {
                style[prop.replace("_","-")] = params.data.v_obsv[kjson][prop].replace("_","-")
                //style[prop] = (params.data.v_obsv[kjson][prop]==null ? '' : params.data.v_obsv[kjson][prop])
              })
              return true
            }
            /*if(kjson.toLowerCase()=="all_fields" && params.data.v_obsv[kjson]!==null){
              Object.keys(params.data.v_obsv[kjson]).map(prop => {
                style[prop] = params.data.v_obsv[kjson][prop]
              })
              return true
            }*/
          })
        }
        return style;
      }
  })

  const getDynamicColumns = (obj) => {
    return Object.keys(obj).map(key => columnDefs(key))
  }

  const cellStyle = (obj) =>{
    return Object.entries(obj).map(([key, value]) => {
        //console.log(value)
      Object.entries(value).map(([keyObj,valueObj]) => {
        //console.log(valueObj)
        //value["cellStyle"] = {background: 'red'}
      })
    })
  }

  const getDataDate = (obj) => {
    Object.keys(obj).map(i => {
      Object.keys(obj[i]).map(key => {
        if(Date.parse(obj[i][key])){
          obj[i][key] = new Date(obj[i][key])
        }
        return obj[i][key] 
      })
    })
  }

  const defColumnDefs = {
    //editable: true,
    //enableRowGroup: true,
    //enablePivot: true,
    //enableValue: true,
    sortable: true,
    resizable: true,
    filter: true,
    flex: 1,
    //tooltipComponent: <p>Hola</p>
    //minWidth: 100
  }

  const request_gettabledata = async (body) => {
    //const base_url='http://localhost:8080'
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
    const response=await fetch(base_url+method, request)
    const json = await response.json();
    return json
  }

  const showTableData = async () => {
    setRowsDetail([])
    setColumnsDetail([])
    try { 
      if(tableSelected.id_proceso<=0 || tableSelected.id_proceso==undefined){
        return;
      }
      console.log("tableSelected")
      console.log([tableSelected])
      console.log(tableSelected)
      setRowsHeader([tableSelected])
      setColumnsHeader(getDynamicColumns(tableSelected))
      const resultados = await request_gettabledata( 
        JSON.stringify({ 
          database: 'D_EWAYA_CONFIG',
          table: 'vw_metadatosprocesosdet',
          where: JSON.stringify({ id_proceso: tableSelected.id_proceso })
        })
      )
      console.log("showTableData")
      console.log(resultados)
      setRowsDetail(resultados)
      setColumnsDetail(getDynamicColumns(resultados[0]))
    } catch (error) {
      console.error("There has been a problem with your fetch operation:", error);
    }
  }

  const showTables = async () => {
    console.log("==========showTables===========")
    try {
      const data = await request_gettabledata( 
        JSON.stringify({ 
          database: 'D_EWAYA_CONFIG',
          table: 'vw_metadatosprocesoscab',
          where: JSON.stringify({ estado: 1 })
        })
      )
      const dataSelect = [];
      console.log(data)
      data.map(function(obj) {
        dataSelect.push({ value: obj["nombre_proceso"] , label: obj["nombre_proceso"], object: obj});
      })
      console.log("======dataSelect======")
      setRowTablesSelect(dataSelect)
      setValueSelect(dataSelect[0])
      setRowTables(data)
      setTableSelected(data[0])
      //setDefaultOption(data[0])
    } catch (error) {
      console.error("There has been a problem with your fetch operation:", error);
    }
  }

  useEffect(()=>{ 
    showTables()
  }, [])
  
  useEffect(()=>{ 
    showTableData()
    //changeTab(1)
  }, [tableSelected])

  useEffect(()=>{ 
    changeTab(1)
  }, [datatablesColumns])

function onRowDataChanged(params){
  const colIds = params.columnApi.getAllGridColumns().map(c => c.colId)
  //console.log(colIds)
  params.columnApi.autoSizeColumns(colIds)
}

  return (
    <div className="App">
      <div className="App-title"><h1 align="center" className="display-5 fw-bold main-title">Metadatos críticos</h1></div>
      <div className="dropdown">
        <div><h5 className="n5 main-subtitle">Proceso: </h5></div>
        <div className="reporte-dropdown">
        <Select
          options={rowsTableSelect}
          value={valueSelect}
          onChange={(e) => handlerTable(e)}
        />
        </div>
        
      </div>
      <div className="App-datatable-header grid ag-theme-alpine"  >
        <AgGridReact
          ref={headerGrid}
          alignedGrids={detailGrid.current ? [detailGrid.current] : undefined}
          defaultColDef={defColumnDefs}
          rowData={rowsHeader}
          columnDefs={columnsHeader}
          onRowDataChanged={onRowDataChanged}
          rowHeight={30}
          />
      </div>
      <div  ><h5  className="datatable-title">Detalle </h5></div>
      <div className="App-datatable-detail grid ag-theme-alpine"  >
        <AgGridReact
          ref={detailGrid}
          alignedGrids={headerGrid.current ? [headerGrid.current] : undefined}
          defaultColDef={defColumnDefs}
          pagination={true}
          paginationPageSize={100}
          rowData={rowsDetail}
          columnDefs={columnsDetail}
          onRowDataChanged={onRowDataChanged}
          rowHeight={30}
          />
      </div>

      
    </div>
  );
}

function callAPI() {
  fetch('http://localhost:8080/getTable').then(
      (response) => response.json()
  ).then((data) => {
      console.log(data)
      this.setState({
          list:data
      })
  })
}

export default Metadatos;
