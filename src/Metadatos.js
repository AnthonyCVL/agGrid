import './Metadatos.css';
import React, { useState, useEffect, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { Button } from 'reactstrap'
import Select from 'react-select';
import { FaSyncAlt } from 'react-icons/fa';
import * as Utilities from './utils/AggridUtil.js';

function Metadatos() {
  const headerGrid = useRef(null);
  const detailGrid = useRef(null);
  const [gridApiHeader, setGridApiHeader] = useState({})
  const [gridApiDetail, setGridApiDetail] = useState({})
  const [rowsHeader, setRowsHeader] = useState([])
  const [columnsHeader, setColumnsHeader] = useState([])
  const [rowsDetail, setRowsDetail] = useState([])
  const [columnsDetail, setColumnsDetail] = useState([])
  const [rowsTableSelect, setRowTablesSelect] = useState([])
  const [valueSelect, setValueSelect] = useState({})
  const [tableSelected, setTableSelected] = useState([])
  const [dataDetail, setDataDetail] = useState([])

  const handlerTable = function (e) {
    setTableSelected(e.object)
    setValueSelect(e)
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

  const send_post = async (base_url, method, request) => {
    const response = await fetch(base_url + method, request)
    const json = await response.json();
    return json
  }

  const showTableData = async () => {
    setRowsHeader([])
    setColumnsHeader([])
    setRowsDetail([])
    setColumnsDetail([])
    try {
      if (tableSelected.id_proceso <= 0 || tableSelected.id_proceso == undefined) {
        return;
      }
      setRowsHeader([tableSelected])
      setColumnsHeader(Utilities.getDynamicColumns(tableSelected))
      const resultados = dataDetail.filter((el) => el['id_proceso'] === tableSelected.id_proceso )
      setRowsDetail(resultados)
      setColumnsDetail(Utilities.getDynamicColumns(resultados[0]))
    } catch (error) {
      console.error("There has been a problem with your fetch operation:", error);
    }
  }

  const showTables = async (refresh = 'false') => {
    setRowTablesSelect([])
    setValueSelect({})
    setTableSelected([])
    try {
      const response_data = await request_getquerydata(
        JSON.stringify({
          database: 'D_EWAYA_CONFIG',
          table: 'vw_metadatosprocesoscab',
          cache_enabled: 'true',
          cache_refresh: refresh
        })
      )
      const data = response_data.result
      const dataSelect = [];
      data.sort(function (a, b) {
        return a.id_proceso - b.id_proceso || a.nombre_proceso.localeCompare(b.nombre_proceso);
      });
      data.map(function (obj) {
        dataSelect.push({ value: obj["nombre_proceso"], label: obj["nombre_proceso"], object: obj });
      })

      const response_detalle = await request_getquerydata(
        JSON.stringify({
          database: 'D_EWAYA_CONFIG',
          table: 'vw_metadatosprocesosdet',
          cache_enabled: 'true',
          cache_refresh: refresh
        })
      )
      setDataDetail(response_detalle.result)
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
  }, [tableSelected])

  const refreshReporte = () => {
    showTables('true')
  }

  const onGridReadyHeader = params => {
    setGridApiHeader(params.api);
  };

  const onGridReadyDetail = params => {
    setGridApiDetail(params.api);
  };

  const onBtnExportDataAsCsvHeader = () => {
    gridApiHeader.exportDataAsCsv();
  };

  const onBtnExportDataAsCsvDetail = () => {
    gridApiDetail.exportDataAsCsv();
  };

  return (
    <div className="App">
      <div className="App-title">
        <h2 align="center" className="display-8 fw-bold main-title">Metadatos de Procesos</h2>
        </div>
      <div className="update-metadatos">
        <h5 className="col-sm-2 main-subtitle">Actualizar Procesos: </h5>
        <div className="col-sm-1">
          <Button className="btnGeneral" onClick={() => refreshReporte()}><FaSyncAlt /></Button>
        </div>
        <div className="col-sm-9"></div>
      </div>
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

        <div className='reporte-button'>
          <Button color="success"
            onClick={() => onBtnExportDataAsCsvHeader()}
            style={{ fontSize: '12px', marginBottom: '5px'}}
          >
            Exportar a CSV
          </Button>
        </div>
        <AgGridReact
          ref={headerGrid}
          alignedGrids={headerGrid.current ? [headerGrid.current] : undefined}
          defaultColDef={Utilities.defColumnDefs}
          rowData={rowsHeader}
          columnDefs={columnsHeader}
          onRowDataChanged={Utilities.onRowDataChanged}
          onGridReady={onGridReadyHeader}
          rowHeight={30}
          gridOptions={Utilities.gridOptionsHeader}
        />
      </div>
      <div className="App-datatable-detail grid ag-theme-alpine"  >
        <div className='reporte-button'>
          <Button color="success"
            onClick={() => onBtnExportDataAsCsvDetail()}
            style={{ fontSize: '12px', marginBottom: '5px'}}
          >
            Exportar a CSV
          </Button>
        </div>
        <AgGridReact
          ref={detailGrid}
          alignedGrids={detailGrid.current ? [detailGrid.current] : undefined}
          defaultColDef={Utilities.defColumnDefs}
          pagination={true}
          paginationPageSize={100}
          rowData={rowsDetail}
          columnDefs={columnsDetail}
          onRowDataChanged={Utilities.onRowDataChanged}
          onGridReady={onGridReadyDetail}
          rowHeight={30}
          gridOptions={Utilities.gridOptions}
        />
      </div>


    </div>
  );
}

export default Metadatos;
