import './Tablero.css';
import React, {useEffect, useState} from 'react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import {Button} from 'reactstrap'
import Select from 'react-select';
import AgGrid from '../../components/AgGrid';
import Modal2 from '../../components/Modal2';
import {FaSyncAlt} from 'react-icons/fa';
import ApiService from "./../../services/apiServices";

function Tablero() {
  const [groupTables, setGroupTables] = useState([])
  const [rowsTableSelect, setRowTablesSelect] = useState([])
  const [valueSelect, setValueSelect] = useState({})
  const [tableSelected, setTableSelected] = useState([])
  const [categoryRowSelect, setCategoryRowSelect] = useState([])
  const [categoryValueSelect, setCategoryValueSelect] = useState({})
  const [categorySelected, setCategorySelected] = useState([])
  const [datatables, setDatatables] = useState([])
  const [openModal, setOpenModal] = useState(false)
  const [tableModal, setTableModal] = useState([])
  const [tableGroupModal, setTableGroupModal] = useState([])
  const [lastUpdateLabel, setLastUpdateLabel] = useState('')
  const [, setDataChart] = useState([])

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

  const showTableData = async (refresh = 'false') => {
    setGroupTables([])
    setDatatables([])
    try {
      if (tableSelected.id_grupo <= 0 || tableSelected.id_grupo === undefined) {
        return;
      }

      const response = await ApiService.getquerydata(
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


      for (const key of Object.keys(group_tables)) {
        promises.push(group_tables[key].id_reporte)
      }
        const resultados = await Promise.all(promises.map(function (key) {
              return ApiService.getquerydata(
            JSON.stringify({
                database: 'D_EWAYA_CONFIG',
                table: 'VW_WebReporte',
                cache_enabled: 'true',
                cache_refresh: refresh,
                where: JSON.stringify({id_reporte: key, state: 1})
            })
        )
      })
      ).then(
        tables => Promise.all(tables.map(async function (tables) {
          const table = tables.result[0]
          const response_query_result = await ApiService.getquerydata(
            JSON.stringify({
              database: table.database_name,
              table: table.table_name,
              select: table.col_qry,
              order: table.ord_qry,
              type: table.id_tiporeporte,
              query: table.full_qry,
              db_engine: table.id_database,
              cache_enabled: 'true',
              cache_refresh: refresh
            })
          )
          const last_update = response.last_update
          const query_result = response_query_result.result
          const response_webreportegrafico = await ApiService.getquerydata(
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
              // eslint-disable-next-line array-callback-return
            webreportegrafico_result.map(function (obj) {
              listChart.push({ id_grafico: obj["id_grafico"], categoria: obj["categoria"], valor: obj["valor"], titulo: obj["titulo"], limite: obj["limite"], object: obj });
            })
          }
          const dt = { id_reporte: table.id_reporte, listChart: listChart, data: query_result }
          const newData = query_result.map(obj => {
            const { Origen, Cantidad_Registros } = obj;
            return { Origen, Cantidad_Registros };
          });
          setDataChart(newData)
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
      const response = await ApiService.getquerydata(
        JSON.stringify({
          database: 'D_EWAYA_CONFIG',
          table: 'VW_WebReporteCategoria',
          where: JSON.stringify({ state: 1 })
        })
      )
      const category = response.result
      const categorySelect = [];
      category.sort(function (a, b) {
        return a.id_categoria - b.id_categoria || a.desc_categoria.localeCompare(b.desc_categoria);
      });
        // eslint-disable-next-line array-callback-return
      category.map(function (obj) {
        categorySelect.push({ value: obj["desc_categoria"], label: obj["desc_categoria"], object: obj });
      })
      setCategoryRowSelect(categorySelect)
      setCategoryValueSelect(categorySelect[0])
      setCategorySelected(category[0])
    } catch (error) {
      console.error("There has been a problem with your fetch operation:", error);
    }
  }

  const showReportes = async () =>{
    try {
      if (categorySelected.id_categoria <= 0 || categorySelected.id_categoria === undefined) {
        return;
      }
      const response = await ApiService.getquerydata(
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
        // eslint-disable-next-line array-callback-return
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

export default Tablero;
