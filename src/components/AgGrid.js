import '../stylesheet/AgGrid.css';
import React, { useState, useEffect, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { TabContent, TabPane, Nav, NavItem, NavLink, Button } from 'reactstrap'

function AgGrid(props) {
  const headerGrid = useRef(null);
  const [rows, setRows] = useState([])
  const [columns, setColumns] = useState([])
  const [datatablesColumns, setDatatablesColumns] = useState([])
  const [activeTab, setActiveTab] = useState("1")
  const [gridApi, setGridApi] = useState({})



  const changeTab = (numberTab) => {
    console.log("changeTab: "+numberTab)
    if (activeTab !== numberTab) {
      console.log("=>setActiveTab")
      setActiveTab(numberTab)
      console.log(props.p_datatables)
      console.log(datatablesColumns)
      console.log(props.p_datatables[numberTab - 1])
      console.log(datatablesColumns[numberTab - 1])
      setRows(props.p_datatables[numberTab - 1])
      setColumns(datatablesColumns[numberTab - 1])
    }
  }

  const columnDefs = (key) => ({
    field: key,
    hide: key.toLowerCase() === 'v_obsv',
    //tooltipComponent: customToolTip,
    cellStyle: params => {
      let style = {};
      if (isNaN(params.value)) {
        style['text-align'] = 'left'
      } else {
        style['text-align'] = 'right'
      }
      //Para todas las celdas valida que el campo v_obsv exista y su contenido sea diferente de null
      if ('v_obsv' in params.data && params.data.v_obsv !== null && params.data.v_obsv !== "") {
        //Valida que el contenido de v_obsv sea un String
        if (typeof params.data.v_obsv === 'string' || params.data.v_obsv instanceof String) {
          //Transforma el JSON en String en un objeto JSON
          params.data.v_obsv = JSON.parse(params.data.v_obsv)
        }
        //Recorre el JSON contenido en v_obsv
        Object.keys(params.data.v_obsv).map(kjson => {
          //Valida que el cellStyle se aplique sobre el campo contenido en cada elemento del JSON de v_obsv
          //Valida que el JSON sea diferente de null
          if ((kjson.toLowerCase() === params.colDef.field.toLowerCase() || kjson.toLowerCase() == "all_fields") && params.data.v_obsv[kjson] !== null) {
            //Aplica estilos a la celda del elemento del JSON de v_obsv
            Object.keys(params.data.v_obsv[kjson]).map(prop => {
              style[prop.replace("_", "-")] = params.data.v_obsv[kjson][prop].replace("_", "-")
              //style[prop] = (params.data.v_obsv[kjson][prop]==null ? '' : params.data.v_obsv[kjson][prop])
            })
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


  useEffect(() => {
    console.log("first useEffect")
    setRows([])
    setColumns([])
    const dtsColumns = []
    props.p_datatables.map(element => {
      dtsColumns.push(getDynamicColumns(element[0]))
    })
    setDatatablesColumns(dtsColumns)
  }, [])

  useEffect(() => {
    console.log("changeTab useEffect")
    changeTab(1)
  }, [datatablesColumns])


  function onRowDataChanged(params) {
    const colIds = params.columnApi.getAllGridColumns().map(c => c.colId)
    params.columnApi.autoSizeColumns(colIds)
  }

  const onGridReady = params => {
    setGridApi(params.api);
  };

  const onBtnExportDataAsCsv = () => {
    gridApi.exportDataAsCsv();
  };

  return (
    <div className="tabs">
      <div className='reporte-button'>
        <Button color="success"
          onClick={() => onBtnExportDataAsCsv()}
          style={{ marginBottom: '5px', fontWeight: 'bold' }}
        >
          Exportar a CSV
        </Button>
      </div>
      <Nav tabs>
        {props.p_grouptables.map(element => (
          <NavItem>
            <NavLink
              className={(activeTab == element.position_table ? "activeTab baseTab" : "baseTab")}
              onClick={() => changeTab(element.position_table)}>
              {element.description}
            </NavLink>
          </NavItem>
        ))}
      </Nav>
      <TabContent activeTab={activeTab}>
        {props.p_grouptables.map(element => (
          <TabPane tabId={element.position_table}>
            <div className="App-datatable ag-theme-alpine" >
              <AgGridReact
                ref={headerGrid}
                alignedGrids={headerGrid.current ? [headerGrid.current] : undefined}
                rowData={rows}
                columnDefs={columns}
                defaultColDef={defColumnDefs}
                pagination={true}
                paginationPageSize={100}
                onRowDataChanged={onRowDataChanged}
                rowHeight={30}
                onGridReady={onGridReady}
              />
            </div>
          </TabPane>
        ))}
      </TabContent>
    </div>
  );
}

export default AgGrid;
