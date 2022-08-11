import './App.css';
import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

function App() {
  const [rows, setRows] = useState([])
  const [columns, setColumns] = useState([])
  const [rowsTable, setRowTables] = useState([])
  const [tableSelected, setTableSelected] = useState([])
  var moment = require('moment')
  let myDate;

  myDate = moment().format("YYYY-MMMM-dddd")
  console.log(myDate)

  const rowData = [
    { make: "Toyota", model: "Celica", price: 35000, date: "09-02-2022", available: true },
    { make: "Ford", model: "Mondeo", price: 32000, date: "11-02-2022", available: false },
    { make: "Porsche", model: "Boxter", price: 72000, date: "10-02-2022", available: true },
    { make: "Mers", model: "Mers", price: 92000, date: "12-02-2022", available: true }
  ];

  const handlerTable = function (e) {
    const option = e.target.value;
    setTableSelected(option)
  }

  // const columns = [{ headerName: "Make", field: "make" },
  // { headerName: "Price", field: "price" },
  // { headerName: "Model", field: "model" },
  // { headerName: "Date", field: "date" }]

  const columnDefs = (key) => ({
      field: key,
      hide: key.toLowerCase()==='v_obsv',
      cellStyle: params => { 
        let style = null;
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
            if(params.colDef.field === kjson.toLowerCase() && params.data.v_obsv[kjson]!==null ){
              //Aplica estilos a la celda del elemento del JSON de v_obsv
              style = { background: params.data.v_obsv[kjson].color}
              return true
            }
          })
        }
        return style;
      }
  })

  const columnDefs_columns = (key) => ({
    field: key,
    hide: key.toLowerCase()==='v_obsv' || key.toLowerCase()==='valid_column' || key.toLowerCase()==='obsv' || key.toLowerCase()==='color',
    cellStyle: params => { 
      let style = null;
      if(params.data.color !== null && params.data.color !== "" ){
        if(key.toLowerCase() === params.data.valid_column){
          style = { background: params.data.color , color: 'white'}
        }
      }
      console.log("style: "+style)
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


  const showTableData = async () => {
    try {
      const response = await fetch('http://localhost:8080/getTableData/D_EWAYA_CONFIG/'+tableSelected);
      //const response = await fetch('http://ms-python-teradata-git-nirvana-qa.apps.ocptest.gp.inet/getTableData/D_EWAYA_CONFIG/'+tableSelected);
      const data = await response.json();
      console.log(data)
      setRows(data)
      setColumns(getDynamicColumns(data[0]))
    } catch (error) {
      console.error("There has been a problem with your fetch operation:", error);
    }
  }

  const showTables = async () => {
    try {
      const response = await fetch('http://localhost:8080/getTableData/D_EWAYA_CONFIG/TB_CONFIG_FE');
      //const response = await fetch('http://ms-python-teradata-git-nirvana-qa.apps.ocptest.gp.inet/getTablesByDatabase/D_EWAYA_CONFIG');
      const data = await response.json();
      setRowTables(data)
    } catch (error) {
      console.error("There has been a problem with your fetch operation:", error);
    }
  }

  useEffect(()=>{ 
    showTableData()
  }, [tableSelected])

  useEffect(()=>{ 
    showTables()
  }, [])

  const cellColor = (obj) => {
    console.log(obj)
    return Object.keys(obj).map(key => ({ field: key }))
  }

/*
  const onGridReady = async (params) => {
    setGridApi(params)
    const dynamycColumns = await getDynamicColumns(rows[0])
    params.api.setColumnDefs(dynamycColumns)
  }
*/
  return (
    <div className="App">
      <div className="App-title"><h1 align="center" className="display-5 fw-bold">Teradata BI</h1></div>
      <div className="App-subtitle"><h2 align="center">Tablas y Vistas</h2></div>
      <div className="dropdown">
        <div><h6 className="n5">Tabla: </h6></div>
        <select name="tablas" className="form-select" onChange={handlerTable}>
          {rowsTable.map(element => (
            <option key={element.TableName} value={element.TableName}>{element.TableName}</option>
          ))}
        </select>
      </div>
      <div className="App-datatable ag-theme-alpine" >
        <AgGridReact
          rowData={rows}
          columnDefs={columns}
          defaultColDef={defColumnDefs}
          pagination={true}
          paginationPageSize={20}
          //onGridReady={onGridReady} 
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

export default App;
