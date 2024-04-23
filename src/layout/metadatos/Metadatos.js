import './Metadatos.css';
import React, {useState, useEffect, useRef} from 'react';
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import {Button} from 'reactstrap'
import Select from 'react-select';
import {FaSyncAlt} from 'react-icons/fa';
import * as Utilities from './../../utils/AggridUtil.js';
import {variables} from "../../utils/variables";
import ApiService from "../../services/apiServices";

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

    const showTableData = async () => {
        setRowsHeader([])
        setColumnsHeader([])
        setRowsDetail([])
        setColumnsDetail([])
        try {
            if (value === 1 || value === 3) {
                if (tableSelected.id_proceso <= 0 || tableSelected.id_proceso === undefined) {
                    return;
                }
            } else if (value === 2) {
                if (tableSelected.TableName === null || tableSelected.TableName === '' || tableSelected.TableName === undefined) {
                    return;
                }
            }
            setRowsHeader([tableSelected])
            setColumnsHeader(Utilities.getDynamicColumns(tableSelected))
            let resultados = dataDetail;
            if (value === 1 || value === 3) {
                resultados = dataDetail.filter((el) => el['id_proceso'] === tableSelected.id_proceso)
            } else if (value === 2) {
                resultados = dataDetail.filter((el) => el['DatabaseName'] === valueSelect.object.DataBaseName && el['TableName'] === tableSelected.TableName)
            }

            setRowsDetail(resultados)
            setColumnsDetail(Utilities.getDynamicColumns(resultados[0]))
        } catch (error) {
            console.error("There has been a problem with your fetch operation:", error);
        }
    }

    const showTables = async (table, tabled, refresh = 'false') => {
        setRowTablesSelect([])
        setValueSelect({})
        setTableSelected([])
        try {
            const response_data = await ApiService.getquerydata(
                JSON.stringify({
                    database: 'D_EWAYA_CONFIG',
                    table: table,
                    cache_enabled: 'true',
                    cache_refresh: refresh
                })
            )
            const data = response_data.result
            const dataSelect = [];
            if (value === 1 || value === 3) {
                data.sort(function (a, b) {
                    return a.id_proceso - b.id_proceso || a.nombre_proceso.localeCompare(b.nombre_proceso);
                });
                data.map(function (obj) {
                    dataSelect.push({value: obj["nombre_proceso"], label: obj["nombre_proceso"], object: obj});
                })
            } else if (value === 2) {
                data.sort(function (a, b) {
                    return a.TableName.localeCompare(b.TableName);
                });
                data.map(function (obj) {
                    dataSelect.push({value: obj["TableName"], label: obj["TableName"], object: obj});
                })
            }


            const response_detalle = await ApiService.getquerydata(
                JSON.stringify({
                    database: 'D_EWAYA_CONFIG',
                    table: tabled,
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
        if (value === 1) {
            showTables('vw_metadatosprocesoscab', 'vw_metadatosprocesosdet')
        } else if (value === 2) {
            showTables('vw_metadatostecnicoscab', 'vw_metadatostecnicosdet')
        } else if (value === 3) {
            showTables('vw_metadatosprocesoscab', 'vw_metadatosoperacionalesdet')
        }

    }, [value])

    useEffect(() => {
        showTableData()
    }, [tableSelected])

    const refreshReporte = () => {
        if (value === 1) {
            showTables('vw_metadatosprocesoscab', 'vw_metadatosprocesosdet', 'true')
        } else if (value === 2) {
            showTables('vw_metadatostecnicoscab', 'vw_metadatostecnicosdet', 'true')
        } else if (value === 3) {
            showTables('vw_metadatosprocesoscab', 'vw_metadatosoperacionalesdet', 'true')
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
                <h2 align="center" className="display-8 fw-bold main-title">
                    {value === 1 ? variables.METADATA_PROCCESS : value === 2 ? variables.METADATA_TECHNICAL : value === 3 ? variables.METADATA_OPERATIONAL : ''}
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
                <div><h5 className="n5 main-subtitle">{value === 1 || value === 3 ? 'Proceso:' : 'Tabla: '}</h5></div>
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

export default Metadatos;