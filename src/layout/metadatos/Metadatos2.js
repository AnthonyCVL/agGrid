import './Metadatos.css';
import React, {useState, useEffect, useRef} from 'react';
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import {Button} from 'reactstrap'
import Select from 'react-select';
import {FaSyncAlt} from 'react-icons/fa';
import * as Utilities from '../../utils/AggridUtil.js';
import ApiService from "../../services/apiServices";
import {variables} from "../../utils/variables";

function Metadatos({value}) {

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

    let title = '';
    const showTableData = async () => {
        setRowsHeader([]);
        setColumnsHeader([]);
        setRowsDetail([]);
        setColumnsDetail([]);

        try {
            if ((value === 1 || value === 3) && (tableSelected.id_proceso > 0 || tableSelected.id_proceso !== undefined)) {
                setRowsHeader([tableSelected]);
                setColumnsHeader(Utilities.getDynamicColumns(tableSelected));
                const resultados = dataDetail.filter((el) => el['id_proceso'] === tableSelected.id_proceso);
                setRowsDetail(resultados);
                setColumnsDetail(Utilities.getDynamicColumns(resultados[0]));
            } else if (value === 2 && (tableSelected.TableName !== null && tableSelected.TableName !== '' && tableSelected.TableName !== undefined)) {
                setRowsHeader([tableSelected]);
                setColumnsHeader(Utilities.getDynamicColumns(tableSelected));
                const resultados = dataDetail.filter((el) => el['DatabaseName'] === valueSelect.object.DataBaseName && el['TableName'] === tableSelected.TableName);
                setRowsDetail(resultados);
                setColumnsDetail(Utilities.getDynamicColumns(resultados[0]));
            }
        } catch (error) {
            console.error("There has been a problem with your fetch operation:", error);
        }
    };


    const fetchData = async (tableName, columnName, cacheRefresh) => {
        const response_data = await ApiService.getquerydata(
            JSON.stringify({
                database: 'D_EWAYA_CONFIG',
                table: tableName,
                cache_enabled: 'true',
                cache_refresh: cacheRefresh,
            })
        );
        const data = response_data.result;
        const dataSelect = [];
        data.sort((a, b) =>
            a[columnName].localeCompare(b[columnName])
        );
        // eslint-disable-next-line array-callback-return
        data.map((obj) => {
            dataSelect.push({value: obj[columnName], label: obj[columnName], object: obj});
        });
        return dataSelect;
    };

    const createShowTablesFunc = (tableName, columnName) => async (refresh = 'false') => {
        setRowTablesSelect([]);
        setValueSelect({});
        setTableSelected([]);
        try {
            const dataSelect = await fetchData(tableName, columnName, refresh);
            setRowTablesSelect(dataSelect);
            setValueSelect(dataSelect[0]);
            setTableSelected(dataSelect[0].object);

            const response_detalle = await ApiService.getquerydata(
                JSON.stringify({
                    database: 'D_EWAYA_CONFIG',
                    table: tableName,
                    cache_enabled: 'true',
                    cache_refresh: refresh,
                })
            );
            setDataDetail(response_detalle.result);
        } catch (error) {
            console.error("There has been a problem with your fetch operation:", error);
        }
    };

    const showTablesProcesos = createShowTablesFunc('vw_metadatosprocesoscab', 'nombre_proceso');
    const showTablesTecnicos = createShowTablesFunc('vw_metadatostecnicoscab', 'TableName');
    const showTablesOperacionales = createShowTablesFunc('vw_metadatosprocesoscab', 'nombre_proceso');


    useEffect(() => {
        switch (value) {
            case 1:
                showTablesProcesos();
                break;
            case 2:
                showTablesTecnicos();
                break;
            case 3:
                showTablesOperacionales();
                break;
        }
    }, [value])

    useEffect(() => {
        showTableData()
    }, [tableSelected])

    const refreshReporte = () => {
        switch (value) {
            case 1:
                showTablesProcesos();
                break;
            case 2:
                showTablesTecnicos();
                break;
            case 3:
                showTablesOperacionales();
                break;
        }
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
                <p>{title}</p>
                <h2 align="center" className="display-8 fw-bold main-title">
                    {value === 1 ? variables.METADATA_PROCCESS : value === 2 ? variables.METADATA_TECHNICAL : variables.METADATA_OPERATIONAL}
                </h2>
            </div>
            <div className="update-metadatos">
                <h5 className="col-sm-2 main-subtitle">Actualizar Procesos: </h5>
                <div className="col-sm-1">
                    <Button className="btnGeneral" onClick={() => refreshReporte()}><FaSyncAlt/></Button>
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
            <div className="App-datatable-header grid ag-theme-alpine">

                <div className='reporte-button'>
                    <Button color="success"
                            onClick={() => onBtnExportDataAsCsvHeader()}
                            style={{fontSize: '12px', marginBottom: '5px'}}
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
            <div className="App-datatable-detail grid ag-theme-alpine">
                <div className='reporte-button'>
                    <Button color="success"
                            onClick={() => onBtnExportDataAsCsvDetail()}
                            style={{fontSize: '12px', marginBottom: '5px'}}
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

/*function Metadatos2({value}) {


    const {rowsTableSelect, setRowsTableSelect} = useState([]);
    const [valueSelect, setValueSelect] = useState({});
    const [tableSelected, setTableSelected] = useState([]);


    const createShowTablesFunc = (tableName, columnName) => async (refresh = 'false') => {
        setRowsTableSelect([]);
        try {
            const dataSelect = await fetchData(tableName, columnName, refresh);
            setRowsTableSelect(dataSelect);
            setValueSelect(dataSelect[0]);
            setTableSelected(dataSelect[0].object);
        } catch (error) {
            console.error("There has been a problem with your fetch operation:", error);
            return [];
        }
    };

    useEffect(() => {
        switch (value) {
            case 1:
                createShowTablesFunc('vw_metadatosprocesoscab', 'nombre_proceso');
                break;
            case 2:
                setRowsTableSelect(createShowTablesFunc('vw_metadatostecnicoscab', 'TableName'));
                break;
            case 3:
                setRowsTableSelect(createShowTablesFunc('vw_metadatosoperacionalesdet', 'nombre_proceso'));
                break;
        }
    }, [])

    const refreshReporte = () => {
        switch (value) {
            case 1:
                createShowTablesFunc('vw_metadatosprocesoscab', 'nombre_proceso');
                break;
            case 2:
                createShowTablesFunc('vw_metadatostecnicoscab', 'TableName');
                break;
            case 3:
                createShowTablesFunc('vw_metadatosoperacionalesdet', 'nombre_proceso');
                break;
        }
    }

    return (
        <div className="App">
            <div className="App-title">
                <p>{value}</p>
                <h2 align="center" className="display-8 fw-bold main-title">

                </h2>
            </div>
            <div className="update-metadatos">
                <h5 className="col-sm-2 main-subtitle">Actualizar Procesos: </h5>
                <div className="col-sm-1">
                    <Button className="btnGeneral" onClick={() => refreshReporte()}><FaSyncAlt/></Button>
                </div>
                <div className="col-sm-9"></div>
            </div>
            <div className="dropdown">
                <div><h5 className="n5 main-subtitle">Proceso: </h5></div>
                <div className="reporte-dropdown">
                    <Select
                        options={rowsTableSelect}
                        value={valueSelect}
                    />
                </div>

            </div>
            <div className="App-datatable-header grid ag-theme-alpine">

                <div className='reporte-button'>
                    <Button color="success"
                            style={{fontSize: '12px', marginBottom: '5px'}}>
                        Exportar a CSV
                    </Button>
                </div>
            </div>
            <div className="App-datatable-detail grid ag-theme-alpine">
                <div className='reporte-button'>
                    <Button color="success"
                            style={{fontSize: '12px', marginBottom: '5px'}}>
                        Exportar a CSV
                    </Button>
                </div>

            </div>
        </div>
    )

    /!*const headerGrid = useRef(null);
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

    const value = 1;
    const showTableData = async () => {
        setRowsHeader([]);
        setColumnsHeader([]);
        setRowsDetail([]);
        setColumnsDetail([]);

        try {
            if (value === 1 && (tableSelected.id_proceso > 0 || tableSelected.id_proceso !== undefined)) {
                setRowsHeader([tableSelected]);
                setColumnsHeader(Utilities.getDynamicColumns(tableSelected));
                const resultados = dataDetail.filter((el) => el['id_proceso'] === tableSelected.id_proceso);
                setRowsDetail(resultados);
                setColumnsDetail(Utilities.getDynamicColumns(resultados[0]));
            } else if (value === 2 && (tableSelected.TableName !== null && tableSelected.TableName !== '' && tableSelected.TableName !== undefined)) {
                setRowsHeader([tableSelected]);
                setColumnsHeader(Utilities.getDynamicColumns(tableSelected));
                const resultados = dataDetail.filter((el) => el['DatabaseName'] === valueSelect.object.DataBaseName && el['TableName'] === tableSelected.TableName);
                setRowsDetail(resultados);
                setColumnsDetail(Utilities.getDynamicColumns(resultados[0]));
            } else if (value === 3 && (tableSelected.id_proceso > 0 || tableSelected.id_proceso !== undefined)) {
                setRowsHeader([tableSelected]);
                setColumnsHeader(Utilities.getDynamicColumns(tableSelected));
                const resultados = dataDetail.filter((el) => el['id_proceso'] === tableSelected.id_proceso);
                setRowsDetail(resultados);
                setColumnsDetail(Utilities.getDynamicColumns(resultados[0]));
            }
        } catch (error) {
            console.error("There has been a problem with your fetch operation:", error);
        }
    };


    const fetchData = async (tableName, columnName, cacheRefresh) => {
        const response_data = await ApiService.getquerydata(
            JSON.stringify({
                database: 'D_EWAYA_CONFIG',
                table: tableName,
                cache_enabled: 'true',
                cache_refresh: cacheRefresh,
            })
        );
        const data = response_data.result;
        const dataSelect = [];
        data.sort((a, b) =>
            a[columnName].localeCompare(b[columnName])
        );
        // eslint-disable-next-line array-callback-return
        data.map((obj) => {
            dataSelect.push({value: obj[columnName], label: obj[columnName], object: obj});
        });
        return dataSelect;
    };

    const createShowTablesFunc = (tableName, columnName) => async (refresh = 'false') => {
        setRowTablesSelect([]);
        setValueSelect({});
        setTableSelected([]);
        try {
            const dataSelect = await fetchData(tableName, columnName, refresh);
            setRowTablesSelect(dataSelect);
            setValueSelect(dataSelect[0]);
            setTableSelected(dataSelect[0].object);

            const response_detalle = await ApiService.getquerydata(
                JSON.stringify({
                    database: 'D_EWAYA_CONFIG',
                    table: tableName,
                    cache_enabled: 'true',
                    cache_refresh: refresh,
                })
            );
            setDataDetail(response_detalle.result);
        } catch (error) {
            console.error("There has been a problem with your fetch operation:", error);
        }
    };

    /!*const showTablesProcesos = createShowTablesFunc('vw_metadatosprocesoscab', 'nombre_proceso');
    const showTablesTecnicos = createShowTablesFunc('vw_metadatostecnicoscab', 'TableName');
    const showTablesOperacionales = createShowTablesFunc('vw_metadatosoperacionalesdet', 'nombre_proceso');*!/

    switch (value) {
        case 1:
            createShowTablesFunc('vw_metadatosprocesoscab', 'nombre_proceso');
            break;
        case 2:
            createShowTablesFunc('vw_metadatostecnicoscab', 'TableName');
            break;

        case 3:
            createShowTablesFunc('vw_metadatosoperacionalesdet', 'nombre_proceso');
            break;
    }
    /!*useEffect(() => {
      if (value === 1){
        showTablesProcesos()
      }else if (value === 2){
        showTablesTecnicos()
      }else if(value === 3){
        showTablesOperacionales()
      }
    }, [])*!/

    useEffect(() => {
        showTableData()
    }, [tableSelected])

    const refreshReporte = () => {
        switch (value) {
            case 1:
                createShowTablesFunc('vw_metadatosprocesoscab', 'nombre_proceso');
                break;
            case 2:
                createShowTablesFunc('vw_metadatostecnicoscab', 'TableName');
                break;

            case 3:
                createShowTablesFunc('vw_metadatosoperacionalesdet', 'nombre_proceso');
                break;
        }
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
                <p>{value}</p>
                <h2 align="center" className="display-8 fw-bold main-title">
                    {variables.METADATA_PROCCESS}
                    {/!*{variables.METADATA_TECHNICAL}
          {variables.METADATA_OPERATIONAL}*!/}
                </h2>
            </div>
            <div className="update-metadatos">
                <h5 className="col-sm-2 main-subtitle">Actualizar Procesos: </h5>
                <div className="col-sm-1">
                    <Button className="btnGeneral" onClick={() => refreshReporte()}><FaSyncAlt/></Button>
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
            <div className="App-datatable-header grid ag-theme-alpine">

                <div className='reporte-button'>
                    <Button color="success"
                            onClick={() => onBtnExportDataAsCsvHeader()}
                            style={{fontSize: '12px', marginBottom: '5px'}}
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
            <div className="App-datatable-detail grid ag-theme-alpine">
                <div className='reporte-button'>
                    <Button color="success"
                            onClick={() => onBtnExportDataAsCsvDetail()}
                            style={{fontSize: '12px', marginBottom: '5px'}}
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
    );*!/
}*/

/*async function fetchData(tableName, columnName, cacheRefresh) {
    const response_data = await ApiService.getquerydata(
        JSON.stringify({
            database: 'D_EWAYA_CONFIG',
            table: tableName,
            cache_enabled: 'true',
            cache_refresh: cacheRefresh,
        })
    );
    const data = response_data.result;
    const dataSelect = [];
    data.sort((a, b) =>
        a[columnName].localeCompare(b[columnName])
    );
    // eslint-disable-next-line array-callback-return
    data.map((obj) => {
        dataSelect.push({value: obj[columnName], label: obj[columnName], object: obj});
    });
    return dataSelect;
}*/


export default Metadatos;
