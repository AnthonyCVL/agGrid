import './Tablero.css';
import React, { useState, useEffect, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { TabContent, TabPane, Nav, NavItem, NavLink, Button } from 'reactstrap'
import Select from 'react-select';

function Tablero() {
  const headerGrid = useRef(null);
  const [rows, setRows] = useState([])
  const [groupTables, setGroupTables] = useState([])
  const [columns, setColumns] = useState([])
  const [rowsTableSelect, setRowTablesSelect] = useState([])
  const [valueSelect, setValueSelect] = useState({})
  const [tableSelected, setTableSelected] = useState([])
  const [datatables, setDatatables] = useState([]);
  const [datatablesColumns, setDatatablesColumns] = useState([])
  const [activeTab, setActiveTab] = useState("1")
  const [gridApi, setGridApi] = useState({})

  const addElementToArray = async (list, element) => {
    list.push(element)
  }

  const changeTab = (numberTab) => {
    if (activeTab !== numberTab) {
      setActiveTab(numberTab)
      setRows(datatables[numberTab - 1])
      setColumns(datatablesColumns[numberTab - 1])
    }
  }

  const handlerTable = function (e) {
    setTableSelected(e.object)
    setValueSelect(e)
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

  const request_gettabledata = async (body) => {
    //const base_url='http://localhost:8080'
    const base_url = 'http://ms-python-teradata-nirvana-qa.apps.ocptest.gp.inet'
    const method = '/getTableData2'
    const request = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: body
    };
    return await send_post(base_url, method, request)
  }

  const send_post = async (base_url, method, request) => {
    const response = await fetch(base_url + method, request)
    const json = await response.json();
    return json
  }

  const showTableData = async () => {
    setRows([])
    setColumns([])
    try {
      if (tableSelected.id <= 0 || tableSelected.id == undefined) {
        return;
      }

      const group_tables = await request_gettabledata(
        JSON.stringify({
          database: 'D_EWAYA_CONFIG',
          table: 'TB_CONFIG_FE_GROUP_TABLE',
          where: JSON.stringify({ id_group: tableSelected.id, state: 1 })
        })
      )
      setGroupTables(group_tables.sort((a, b) => a.position_table > b.position_table ? 1 : -1))
      const dts = []
      const promises = []


      Object.keys(group_tables).forEach(async function (key) {
        promises.push(group_tables[key].id_table)
      });

      const resultados = await Promise.all(promises.map(function (key) {
        const tables = request_gettabledata(
          JSON.stringify({
            database: 'D_EWAYA_CONFIG',
            table: 'TB_CONFIG_FE',
            where: JSON.stringify({ id: key, state: 1 })
          })
        )
        return tables
      })
      ).then(
        tables => Promise.all(tables.map(async function (tables) {
          const table = tables[0]
          const dt = await request_gettabledata(
            JSON.stringify({
              database: table.database_name,
              table: table.table_name,
              select: table.col_qry,
              order: table.ord_qry,
              type: table.type_qry,
              query: table.full_qry
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
      const dtsColumns = []
      resultados.map(element => {
        dtsColumns.push(getDynamicColumns(element[0]))
      })
      setDatatablesColumns(dtsColumns)
    } catch (error) {
      console.error("There has been a problem with your fetch operation:", error);
    }
  }

  const showTables = async () => {
    try {
      //const response = await fetch('http://localhost:8080/getTableData?database=D_EWAYA_CONFIG&table=TB_CONFIG_FE_GROUP');
      const response = await fetch('http://ms-python-teradata-nirvana-qa.apps.ocptest.gp.inet/getTableData?database=D_EWAYA_CONFIG&table=TB_CONFIG_FE_GROUP');
      const data = await response.json();
      const dataSelect = [];
      data.sort(function (a, b) {
        return a.id - b.id || a.name.localeCompare(b.name);
      });
      data.map(function (obj) {
        dataSelect.push({ value: obj["name"], label: obj["name"], object: obj });
      })
      setRowTablesSelect(dataSelect)
      setValueSelect(dataSelect[0])
      setTableSelected(data[0])
    } catch (error) {
      console.error("There has been a problem with your fetch operation:", error);
    }
  }

  useEffect(() => {
    showTables()
  }, [])

  useEffect(() => {
    showTableData()
    setActiveTab(0)
  }, [tableSelected])

  useEffect(() => {
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
    <div className="App">
      <div className="App-title"><h1 align="center" className="display-5 fw-bold main-title">Tablero BI</h1></div>
      <div className="dropdown">
        <div><h5 className="n5 main-subtitle">Reporte: </h5></div>
        <div className="reporte-dropdown">
          <Select
            options={rowsTableSelect}
            value={valueSelect}
            onChange={(e) => handlerTable(e)}
          />
        </div>
      </div>


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
          {groupTables.map(element => (
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
          {groupTables.map(element => (
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
    </div>
  );
}

export default Tablero;
