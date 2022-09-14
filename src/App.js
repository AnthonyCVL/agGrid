import './App.css';
import React, { useState, useEffect , useMemo} from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import {TabContent, TabPane, Nav, NavItem, NavLink} from 'reactstrap'

function App() {
  const [rows, setRows] = useState([])
  const [groupTables, setGroupTables] = useState([])
  const [columns, setColumns] = useState([])
  const [rowsTable, setRowTables] = useState([])
  const [tableSelected, setTableSelected] = useState([])
  const [datatables, setDatatables] = useState([]);
  const [datatablesColumns, setDatatablesColumns] = useState([])
  const [defaultOption, setDefaultOption] = useState(0);
  const [activeTab, setActiveTab] = useState("1")

  const addDatatable = async (dt) => {
    setDatatables([...datatables, dt])
  }

  const addElementToArray = async (list, element) => {
    list.push(element)
  }

  const changeTab = (numberTab) => {
    console.log("changeTab")
    console.log(activeTab)
    console.log(numberTab)
    if(activeTab !== numberTab){
      setActiveTab(numberTab)
      setRows(datatables[numberTab-1])
      setColumns(datatablesColumns[numberTab-1])
      console.log(datatables[numberTab-1])
      console.log(datatablesColumns[numberTab-1])
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
    console.log("handlerTable")
    const option = JSON.parse(e.target.value);
    setTableSelected(option)
  }

/*const customToolTip = (props) => {
    const data = useMemo(
      () => props.api.getDisplayedRowAtIndex(props.rowIndex).data,
      []
    );
  
    return (
      <div
        className="custom-tooltip"
        style={{ backgroundColor: props.color || 'white' }}
      >
        <p>
          <span>{data.num_row}</span>
        </p>
        <p>
          <span>Country: </span> {data.last_load}
        </p>
        <p>
          <span>Total: </span> {data.val_max}
        </p>
      </div>
    );
  };
*/
  // const columns = [{ headerName: "Make", field: "make" },
  // { headerName: "Price", field: "price" },
  // { headerName: "Model", field: "model" },
  // { headerName: "Date", field: "date" }]

  const columnDefs = (key) => ({
      field: key,
      hide: key.toLowerCase()==='v_obsv',
      //tooltipComponent: customToolTip,
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


  const showTableData2 = async () => {
    try {
      //const base_url='http://localhost:8080'
      const base_url='http://ms-python-teradata-git-nirvana-qa.apps.ocptest.gp.inet'
      const params_group='/getTableData?database=D_EWAYA_CONFIG&table='+tableSelected.table_name
      const response_group=await fetch(base_url+params_group)
      const response = await fetch(base_url+'/getTableData?database=D_EWAYA_CONFIG&table='+tableSelected.table_name+'&select='+tableSelected.col_qry+'&order='+tableSelected.ord_qry);
      const data = await response.json();
      console.log(data)
      setRows(data)
      setColumns(getDynamicColumns(data[0]))
    } catch (error) {
      console.error("There has been a problem with your fetch operation:", error);
    }
  }

  const request_gettabledata = async (body) => {
    const base_url='http://localhost:8080'
    //const base_url='http://ms-python-teradata-git-nirvana-qa.apps.ocptest.gp.inet'
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

  const request_gettabledata2 = async (body) => {
    const base_url='http://localhost:8080'
    //const base_url='http://ms-python-teradata-git-nirvana-qa.apps.ocptest.gp.inet'
    const method = '/getTableData2'
    const request = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: body
    };
    return await send_post2(base_url, method, request)
  }

  const send_post2 = async (base_url, method, request) => {
    return fetch(base_url+method, request)
     
  }

  const showTableData = async () => {
    console.log("showTableData async")
    console.log(groupTables)
    try { 
      console.log("tableSelected.id")
      console.log(tableSelected.id)
      if(tableSelected.id<=0 || tableSelected.id==undefined){
        return;
      }
        const group_tables = await request_gettabledata( 
          JSON.stringify({ 
            database: 'D_EWAYA_CONFIG',
            table: 'TB_CONFIG_FE_GROUP_TABLE',
            where: JSON.stringify({ id_group: tableSelected.id, state: 1 })
          })
        )
      
      //setRows(group_tables)
    console.log(groupTables)
      setGroupTables(group_tables.sort((a, b) => a.position_table > b.position_table ? 1 : -1))
      const dts = []
      const promises=[]

      
      Object.keys(group_tables).forEach(async function(key) {
        promises.push(group_tables[key].id_table)
      });

      const resultados = await Promise.all( promises.map( function(key) {
        console.log(key)
        const tables =  request_gettabledata( 
          JSON.stringify({ 
            database: 'D_EWAYA_CONFIG',
            table: 'TB_CONFIG_FE',
            where: JSON.stringify({ id: key, state: 1})
          })
        )
        return tables
      })  
      ).then(
        tables => Promise.all(tables.map( async function(tables){
          const table = tables[0]
          const dt = await request_gettabledata( 
            JSON.stringify({ 
              database: table.database_name,
              table: table.table_name,
              select: table.col_qry,
              order: table.ord_qry
            })
          )
          addElementToArray(dts, dt)
          return dt
        }
        )
      ).then(
        dt => {
          return dt
        }
      )
      )
        
      setDatatables(resultados)
      const dtsColumns= []
      resultados.map(element => {
        dtsColumns.push(getDynamicColumns(element[0]))
      })
      setDatatablesColumns(dtsColumns)
    } catch (error) {
      console.error("There has been a problem with your fetch operation:", error);
    }
  }

  const showTableData3 = async () => {
    try { 
      const group_tables = await request_gettabledata( 
        JSON.stringify({ 
          database: 'D_EWAYA_CONFIG',
          table: 'TB_CONFIG_FE_GROUP_TABLE',
          where: JSON.stringify({ id_group: tableSelected.id, state: 1 })
        })
      )
      console.log("group_tables")
      console.log(group_tables)
      setRows(group_tables)
      setGroupTables(group_tables)
      const dts = []

      Object.keys(group_tables).forEach(async function(key) {
        const tables = await request_gettabledata( 
          JSON.stringify({ 
            database: 'D_EWAYA_CONFIG',
            table: 'TB_CONFIG_FE',
            where: JSON.stringify({ id: group_tables[key].id_table, state: 1})
          })
        )
        console.log("TABLES")
        console.log(tables)
        const table = tables[0]
        console.log("TABLE")
        console.log(table)
        const dt = await request_gettabledata( 
          JSON.stringify({ 
            database: table.database_name,
            table: table.table_name,
            select: table.col_qry,
            order: table.ord_qry
          })
        )
        //dts.push(dt)
        addElementToArray(dts, dt)
        console.log("dt")
        console.log(dt)
      });
      console.log("dts")
      console.log(dts)
      setDatatables(dts)
      console.log("DATATABLESSSSSSSSSSSSSSSSSSSSSSSSSSSS")
      console.log(datatables)
      //const response = await fetch(base_url+'/getTableData?database=D_EWAYA_CONFIG&table='+tableSelected.table_name+'&select='+tableSelected.col_qry+'&order='+tableSelected.ord_qry);
      //const data = await response.json();
      setColumns(getDynamicColumns(group_tables[0]))
    } catch (error) {
      console.error("There has been a problem with your fetch operation:", error);
    }
  }

  const showTables = async () => {
    try {
      const response = await fetch('http://localhost:8080/getTableData?database=D_EWAYA_CONFIG&table=TB_CONFIG_FE_GROUP');
      //const response = await fetch('http://ms-python-teradata-git-nirvana-qa.apps.ocptest.gp.inet/getTableData?database=D_EWAYA_CONFIG&table=TB_CONFIG_FE_GROUP');
      const data = await response.json();
      setRowTables(data)
      setTableSelected(data[0])
      //setDefaultOption(data[0])
    } catch (error) {
      console.error("There has been a problem with your fetch operation:", error);
    }
  }

  useEffect(()=>{ 
    console.log("showTables")
    showTables()
  }, [])
  
  useEffect(()=>{ 
    console.log("showTableData")
    showTableData()
    setActiveTab(0)
    //changeTab(1)
  }, [tableSelected])

  /*useEffect(()=>{ 
    console.log("handlerTable")
    setTableSelected(option)
  }, [defaultOption])*/

  useEffect(()=>{ 
    console.log("datatablesColumns updated")
    changeTab(1)
  }, [datatablesColumns])

  
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
function onFirstDataRendered (params) {
  params.api.sizeColumnsToFit()
  const colIds = params.columnApi.getAllColumns().map(c => c.colId)
  params.columnApi.autoSizeColumns(colIds)

}

  return (
    <div className="App">
      <div className="App-title"><h1 align="center" className="display-5 fw-bold">Teradata BI</h1></div>
      <div className="App-subtitle"><h2 align="center">Tablas y Vistas</h2></div>
      <div className="dropdown">
        <div><h6 className="n5">Tabla: </h6></div>
        <select name="tablas" className="form-select" onChange={handlerTable} defaultValue={defaultOption.id}>
          {rowsTable.map(element => (
            <option key={element.id} value={JSON.stringify(element)}>{element.name}</option>
          ))}
        </select>
      </div>
      <div className="tabs">
        <Nav tabs>
          {groupTables.map(element => (
            <NavItem>
              <NavLink 
              className={(activeTab==element.position_table ? "activeTab baseTab" : "baseTab")}
              onClick = {() => changeTab(element.position_table)}>
                {element.description}
              </NavLink>
            </NavItem>
          ))}
        </Nav>
        <TabContent activeTab={activeTab}>
          {groupTables.map(element => (
            <TabPane tabId={element.position_table}>
              <div className="App-datatable ag-theme-alpine" >
                <AgGridReact
                  rowData={rows}
                  columnDefs={columns}
                  defaultColDef={defColumnDefs}
                  pagination={true}
                  paginationPageSize={20}
                  onFirstDataRendered={onFirstDataRendered}
                  //onGridReady={onGridReady} 
                  />
              </div>
            </TabPane>
          ))}
        </TabContent>
      </div>
      <div className="App-datatable ag-theme-alpine" hidden="hidden">
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
