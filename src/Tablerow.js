import './Tablero.css';
import React, { useState, useEffect, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { TabContent, TabPane, Nav, NavItem, NavLink, Button } from 'reactstrap'
import Select from 'react-select';
import AgGrid from './components/AgGrid';
import Modal2 from './components/Modal2';
import ModalMenu from './components/ModalMenu';
import { FaSyncAlt, FaUndoAlt } from 'react-icons/fa';

function Tablerow() {
  const [groupTables, setGroupTables] = useState([])
  const [rowsTableSelect, setRowTablesSelect] = useState([])
  const [valueSelect, setValueSelect] = useState({})
  const [tableSelected, setTableSelected] = useState([])
  const [categoryRowSelect, setCategoryRowSelect] = useState([])
  const [categoryValueSelect, setCategoryValueSelect] = useState({})
  const [categorySelected, setCategorySelected] = useState([])
  const [datatables, setDatatables] = useState([])
  const [gridApi, setGridApi] = useState({})
  const [openModal, setOpenModal] = useState(false)
  const [openModalMenu, setOpenModalMenu] = useState(false)
  const [tableModal, setTableModal] = useState([])
  const [tableGroupModal, setTableGroupModal] = useState([])
  const [tableModalMenu, setTableModalMenu] = useState([])
  const [tableGroupModalMenu, setTableGroupModalMenu] = useState([])
  const [lastUpdateLabel, setLastUpdateLabel] = useState('')

  const addElementToArray = async (list, element) => {
    list.push(element)
  }

  const handlerTable = function (e) {
    setTableSelected(e.object)
    setValueSelect(e)
  }

  const handlerCategory = function (e) {
    setCategorySelected(e.object)
    setCategoryValueSelect(e)
  }

  const openModalfunction = () => {
    setOpenModal(false)
    const list = []
    list[0] = [{ position: '1', databasename: 'databasename', objectname: 'objectname' }]
    const grouplist = []
    grouplist[0] = [{ position_table: 1, description: 'Reporte' }]
    setTableModal(list)
    setTableGroupModal(grouplist)
  }

  const openModalMenufunction = () => {
    setOpenModalMenu(false)
    const list = []
    list[0] = [{ position: '1', databasename: 'databasename', objectname: 'objectname' }]
    const grouplist = []
    grouplist[0] = [{ position_table: 1, description: 'Reporte' }]
    setTableModal(list)
    setTableGroupModal(grouplist)
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

  const request_getquerydata = async (body) => {
    const base_url = 'http://localhost:8080'
    //const base_url = 'http://ms-python-teradata-nirvana-qa.apps.ocptest.gp.inet'
    const method = '/getQueryData'
    const request = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: body
    };
    return await send_post(base_url, method, request)
  }

  const request_gettabledata = async (body) => {
    const base_url = 'http://localhost:8080'
    //const base_url = 'http://ms-python-teradata-nirvana-qa.apps.ocptest.gp.inet'
    const method = '/getTableData2'
    const request = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: body
    };
    return await send_post(base_url, method, request)
  }

  const request_getwebreport = async (body) => {
    //const base_url = 'http://localhost:8080'
    const base_url = 'http://ms-python-teradata-nirvana-qa.apps.ocptest.gp.inet'
    const method = '/getWebReport'
    const request = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: body
    };
    return await send_post(base_url, method, request)
  }

  const send_post = async (base_url, method, request) => {
    const response = await Promise.race(
      [timeoutAfter(300), fetch(base_url + method, request)]
    );
    const json = await response.json();
    return json
  }

  function timeoutAfter(seconds) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error("request timed-out"));
      }, seconds * 1000);
    });
  }

  const showTableData = async (refresh = 'false') => {
    console.log("showTableData")
    setGroupTables([])
    setDatatables([])
    try {
      if (tableSelected.id_grupo <= 0 || tableSelected.id_grupo == undefined) {
        return;
      }

      const response = await request_getquerydata(
        JSON.stringify({
          database: 'D_EWAYA_CONFIG',
          table: 'VW_WebGrupoReporte',
          cache_enabled: 'true',
          cache_refresh: refresh,
          where: JSON.stringify({ id_grupo: tableSelected.id_grupo, state: 1 })
        })
      )
      const group_tables = response.result
      setGroupTables(group_tables.sort((a, b) => a.position_table > b.position_table ? 1 : -1))
      const dts = []
      const promises = []


      Object.keys(group_tables).forEach(async function (key) {
        promises.push(group_tables[key].id_reporte)
      });
      const resultados = await Promise.all(promises.map(function (key) {
        const tables = request_getquerydata(
          JSON.stringify({
            database: 'D_EWAYA_CONFIG',
            table: 'VW_WebReporte',
            cache_enabled: 'true',
            cache_refresh: refresh,
            where: JSON.stringify({ id_reporte: key, state: 1 })
          })
        )
        console.log("responseeeeee")
        console.log(tables)
        return tables
      })
      ).then(
        tables => Promise.all(tables.map(async function (tables) {
          const table = tables.result[0]
          const response_query_result = await request_getquerydata(
            JSON.stringify({
              database: table.database_name,
              table: table.table_name,
              select: table.col_qry,
              order: table.ord_qry,
              type: table.id_tiporeporte,
              query: table.full_qry,
              cache_enabled: 'true',
              cache_refresh: refresh
            })
          )
          const last_update = response.last_update
          const query_result = response_query_result.result
          const response_webreportegrafico = await request_getquerydata(
            JSON.stringify({
              database: 'D_EWAYA_CONFIG',
              table: 'GD_WebReporteGrafico',
              cache_enabled: 'true',
              cache_refresh: refresh,
              where: JSON.stringify({ id_reporte: table.id_reporte })
            }))
          const webreportegrafico_result = response_webreportegrafico.result
          const listChart = []
          if (webreportegrafico_result.length > 0) {
            webreportegrafico_result.map(function (obj) {
              listChart.push({ id_grafico: obj["id_grafico"], categoria: obj["categoria"], valor: obj["valor"], titulo: obj["titulo"], limite: obj["limite"], object: obj });
            })
          }
          const dt = { id_reporte: table.id_reporte, listChart: listChart, data: query_result }
          setLastUpdateLabel(last_update)
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
    } catch (error) {
      console.error("There has been a problem with your fetch operation:", error);
    }
  }

  const showCategory = async () => {
    try {
      console.log('showCategory')
      const response = await request_getquerydata(
        JSON.stringify({
          database: 'D_EWAYA_CONFIG',
          table: 'VW_WebReporteCategoria',
          where: JSON.stringify({ state: 1 })
        })
      )
      const category = response.result
      console.log('category')
      console.log(category)
      const categorySelect = [];
      category.sort(function (a, b) {
        return a.id_categoria - b.id_categoria || a.desc_categoria.localeCompare(b.desc_categoria);
      });
      console.log(category)
      category.map(function (obj) {
        categorySelect.push({ value: obj["desc_categoria"], label: obj["desc_categoria"], object: obj });
      })
      console.log(categorySelect)
      setCategoryRowSelect(categorySelect)
      setCategoryValueSelect(categorySelect[0])
      setCategorySelected(category[0])
    } catch (error) {
      console.error("There has been a problem with your fetch operation:", error);
    }
  }

  const showReportes = async () =>{
    try {
      console.log('showReportes')
      console.log(categorySelected)
      if (categorySelected.id_categoria <= 0 || categorySelected.id_categoria == undefined) {
        return;
      }
      
      const response = await request_getquerydata(
        JSON.stringify({
          database: 'D_EWAYA_CONFIG',
          table: 'VW_WebGrupo',
          where: JSON.stringify({ state: 1 , id_categoria: categorySelected.id_categoria})
        })
      )
      const data = response.result
      const dataSelect = [];
      data.sort(function (a, b) {
        return a.id_grupo - b.id_grupo || a.name.localeCompare(b.name);
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
    showCategory()
  }, [])

  useEffect(() => {
    showReportes()
  }, [categorySelected])

  useEffect(() => {
    showTableData()
  }, [tableSelected])

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

  const consultarReporte = () => {
    showTableData()
  }

  const refreshReporte = () => {
    showTableData('true')
  }

  return (
    <div>
      <div className="App">

        <div className="divReportName mb-3 row">
        </div>
        <div className="divReportName mb-3 row">
          <div className="col-sm-10">
          </div>
        </div>
        <Modal2 open={openModal} onClose={openModalfunction} p_datatables={tableModal} p_grouptables={tableGroupModal}></Modal2>
        {/*<Button onClick={()=>setOpenModalMenu(true)}>Agregar Menu</Button>
      <ModalMenu open={openModalMenu} onClose={openModalMenufunction} p_datatables={tableModalMenu} p_grouptables={tableGroupModalMenu}></ModalMenu>*/}
        <div className="App-title">
          <h2 align="center" className="display-8 fw-bold main-title">Tablero BI</h2>
        </div>
        <div className="dropdown-tablero mb-3 row">
          <div className="col-sm-2">
            <h5 className="n5 main-subtitle">Categoria: </h5>
          </div>
          <div className="reporte-dropdown-tablero col-sm-5 ">
            <Select
              options={categoryRowSelect}
              value={categoryValueSelect}
              onChange={(e) => handlerCategory(e)}
            />
          </div>
          <div className="col-sm-5">
          </div>
        </div>
        <div className="dropdown-tablero mb-3 row">
          <div className="col-sm-2">
            <h5 className="n5 main-subtitle">Reporte: </h5>
          </div>
          <div className="reporte-dropdown-tablero col-sm-5 ">
            <Select
              options={rowsTableSelect}
              value={valueSelect}
              onChange={(e) => handlerTable(e)}
            />
          </div>
          <div className="col-sm-1">
            <Button className="btnGeneral" onClick={() => refreshReporte()}><FaSyncAlt /></Button>
          </div>
          <div className="col-sm-4">
            <h6 className="n5 main-last-update">Actualizado al:</h6>
            <h6 className="n5 main-last-update">{lastUpdateLabel}</h6>
          </div>
        </div>
        <div>
          <AgGrid
            p_grouptables={groupTables}
            p_datatables={datatables} />
        </div>
      </div>
    </div>
  );
}

export default Tablerow;
