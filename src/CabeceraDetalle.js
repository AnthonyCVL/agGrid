import './CabeceraDetalle.css';
import React, { useState, useEffect, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { Button } from 'reactstrap'
import Select from 'react-select';

function CabeceraDetalle({p_params}) {
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
    setRowsDetail([])
    setColumnsDetail([])
    
    const arrHeaderInput = p_params.header.input.split()
    const arrHeaderInputValues = []
    arrHeaderInput.map((el)=>{
      arrHeaderInputValues.push(tableSelected[el])
    })
    //const arrHeaderInput = p_params.header.input.split()
    const arrDetailWhere = p_params.detail.where.split()

    let jsonWhere=''
    arrHeaderInputValues.map((el, i)=>{
      jsonWhere+=`"${arrDetailWhere[i]}" : "${el}"`
    })
    jsonWhere=`{${jsonWhere}}`

    try {
      if (arrHeaderInputValues[0] <= 0 || arrHeaderInputValues[0] == undefined) {
        return;
      }
      setRowsHeader([tableSelected])
      setColumnsHeader(getDynamicColumns(tableSelected))
      
      console.log(p_params.detail.full_qry)
      console.log(jsonWhere)

      const resultados = await request_gettabledata(
        JSON.stringify({
          type: 2,
          query: p_params.detail.full_qry,
          where: jsonWhere
        })
      )
      setRowsDetail(resultados)
      setColumnsDetail(getDynamicColumns(resultados[0]))
    } catch (error) {
      console.error("There has been a problem with your fetch operation:", error);
    }
  }

  const showTables = async () => {
    try {
      console.log(p_params.header.full_qry)
      const data = await request_gettabledata(
        JSON.stringify({
          type: 2,
          query: p_params.header.full_qry
        })
      )
      console.log(data)
      const dataSelect = [];
      data.map(function (obj) {
        dataSelect.push({ value: obj[p_params.header.id_combo], label: obj[p_params.header.desc_combo], object: obj });
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
  }, [tableSelected])

  function onRowDataChanged(params) {
    const colIds = params.columnApi.getAllGridColumns().map(c => c.colId)
    params.columnApi.autoSizeColumns(colIds)
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
        <h2 align="center" className="display-8 fw-bold main-title">{p_params.header.titulo}</h2>
        </div>
      <div className="dropdown">
        <div><h5 className="n5 main-subtitle">{p_params.header.subtitulo}: </h5></div>
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
          defaultColDef={defColumnDefs}
          rowData={rowsHeader}
          columnDefs={columnsHeader}
          onRowDataChanged={onRowDataChanged}
          onGridReady={onGridReadyHeader}
          rowHeight={30}
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
          defaultColDef={defColumnDefs}
          pagination={true}
          paginationPageSize={100}
          rowData={rowsDetail}
          columnDefs={columnsDetail}
          onRowDataChanged={onRowDataChanged}
          onGridReady={onGridReadyDetail}
          rowHeight={30}
        />
      </div>


    </div>
  );
}

export default CabeceraDetalle;