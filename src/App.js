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
        if(params.data.v_obsv !== null && params.data.v_obsv !== "" ){
          Object.keys(params.data.v_obsv).map(key => {
            if(params.colDef.field === key.toLowerCase()){
              style = { background: 'red' }
              return true
            }
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
    flex: 1
    //minWidth: 100
  }


  const showTableData = async () => {
    const response = await fetch('http://ms-python-teradata-git-nirvana-qa.apps.ocptest.gp.inet/getTableData/D_EWAYA_CONFIG/'+tableSelected);
    const data = await response.json();
    console.log(data)
    setRows(data)
    setColumns(getDynamicColumns(data[0]))
  }

  const showTables = async () => {
    const response = await fetch('http://ms-python-teradata-git-nirvana-qa.apps.ocptest.gp.inet/getTablesByDatabase/D_EWAYA_CONFIG');
    const data = await response.json();
    setRowTables(data)
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
  fetch('http://localhost:8083/getTable').then(
      (response) => response.json()
  ).then((data) => {
      console.log(data)
      this.setState({
          list:data
      })
  })
}

export default App;
