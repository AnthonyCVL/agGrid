import '../stylesheet/AgGrid.css';
import React, { useState, useEffect, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import ChartDataLabels from "chartjs-plugin-datalabels";
import { TabContent, TabPane, Nav, NavItem, NavLink, Button } from 'reactstrap'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import data from '../data.json'
import Chart from './Chart';
import BarChart from './BarChart';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ChartDataLabels,
  Title,
  Tooltip,
  Legend
);


function AgGrid(props) {

  const headerGrid = useRef(null);
  const [rows, setRows] = useState([])
  const [columns, setColumns] = useState([])
  const [datatablesColumns, setDatatablesColumns] = useState([])
  const [activeTab, setActiveTab] = useState("0")
  const [gridApi, setGridApi] = useState({})
  const [gridParams, setGridParams] = useState({})
  const [listChart, setListChart] = useState([])
  const [chartData, setChartData] = useState({})
  const [rowsFiltered, setRowsFiltered] = useState({})

  useEffect(() => {
    console.log("start useEffect testst")
    console.log(props.p_datatables[0])
    if (props.p_datatables.length == 0) {
      return;
    }
    buildListChart(props.p_datatables[0].listChart,props.p_datatables[0].data)
    console.log("end main")
  }, [props.p_datatables])

  function buildListChart(lChart, data){
    let list = []
    lChart.map(chart => {
        const chartObject = {
          p_tipo: chart.id_grafico === 1 ? 'Bar' : 'Pie',
          p_data: data,
          p_categoria: chart.categoria,
          p_valor: [chart.valor],
          p_titulo: chart.titulo,
          p_limite: chart.limite
        }
        list.push(chartObject)
      })
      setTimeout(() => {
        setListChart(list)
      }, [])
  }

  
  const groupBy2 = (data, category, values) => {
    const resultArr = [];
    const groupByLocation = data.reduce(category, values, (group, item) => {
      const cat = item[category];
      group[cat] = group[cat] ?? [];
      group[cat].push(item[values]);
      return group;
    }, {});

    // Finally calculating the sum based on the location array we have.
    Object.keys(groupByLocation).forEach(category, values, (item) => {
      groupByLocation[item] = groupByLocation[item].reduce((a, b) => a + b);
      const arr = []
      arr[category] = item
      arr[values] = groupByLocation[item]
      resultArr.push(arr)
    })
    console.log(resultArr)
  }

  const changeTab = (numberTab) => {
    console.log('changeTab')
    console.log(gridParams)
    if (activeTab !== numberTab) {
      setActiveTab(numberTab)
      if (props.p_datatables.length > 0) {
        setRows(props.p_datatables[numberTab - 1].data)
        setColumns(datatablesColumns[numberTab - 1])
      }
    }
  }

  function getRandomColor() {
    var r = Math.floor(Math.random() * 255);
    var g = Math.floor(Math.random() * 255);
    var b = Math.floor(Math.random() * 255);
    return "rgb(" + r + "," + g + "," + b + ")";
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
    console.log("AgGrid useEffect")
    setRows([])
    setColumns([])
    setListChart([])
    setActiveTab(0)
    const dtsColumns = []
    console.log("props.p_datatables")
    console.log(props.p_datatables)
    console.log("props.p_datatables.map")
    props.p_datatables.map(element => {
      console.log(element.data)
      if(element.data.length === 0){
        return
      } 
      console.log(element.data[0])
      dtsColumns.push(getDynamicColumns(element.data[0]))
    })
    setDatatablesColumns(dtsColumns)
  }, [props.p_datatables])

  useEffect(() => {
    changeTab(1)
  }, [datatablesColumns])

  useEffect(() => {
    setRowsFiltered(rows)
  }, [rows])

  useEffect(() => { 
    async function makeRequest() {
      console.log('before');

      await delay(3000);
      if(gridParams!==undefined && Object.keys(gridParams).length !== 0){
        console.log('autosizeeeeee')
        autoSizeColumns(gridParams)
      }

      console.log('after');
    }

    makeRequest();

  }, [activeTab])

  const delay = ms => new Promise(
    resolve => setTimeout(resolve, ms)
  );

  useEffect(() => {
    console.log("rowsFiltered")
    console.log(props)
    console.log(rowsFiltered)
    if(props!==undefined && props.p_datatables.length>0){
      buildListChart(props.p_datatables[0].listChart,rowsFiltered)
    }
  }, [rowsFiltered])

  function onRowDataChanged(params) {
    autoSizeColumns(params)
  }

  function autoSizeColumns(params) {
    console.log("autoSizeColumns")
    console.log(params)
    console.log(params.columnApi)
    if (params.columnApi.columnModel === undefined){
      return
    }
    const colIds = params.columnApi
      .getAllDisplayedColumns()
      .map(col => col.getColId());
    console.log(colIds)
    var column = params.columnApi.getColumn('modelo'); // where field = name
    var column2 = params.columnApi.getColumn('F6_SUM_tmin_90'); // where field = name
    console.log('column info' );
    console.log(column );
    console.log('column info' );
    console.log(column2 );
    params.columnApi.autoSizeColumns(colIds);
  };

  function onFilterChanged(){
    console.log("onFilterChanged")
    let rowData = [];
    gridApi.forEachNodeAfterFilter(node => {
      rowData.push(node.data);
    });
    setRowsFiltered(rowData)
  }

  const onGridReady = params => {
    console.log('onGridReady')
    setGridApi(params.api);
    setGridParams(params)
    autoSizeColumns(params)
  };

  const onBtnExportDataAsCsv = () => {
    gridApi.exportDataAsCsv();
  };

  const btnAutosize = () => {
    autoSizeColumns(gridParams);
  };

  const columnVisible = params => {
    autoSizeColumns(params);
  }

  return (
    <div>
      <div className="tabs">
        <div className={`reporte-button ${(props.p_datatables.length == 0 ? "div-hidden" : "")}`}>
        <Button color="success"
            onClick={() => btnAutosize()}
            style={{ fontSize: '12px' }}
          >
            Autosize
          </Button>
          <Button color="success"
            onClick={() => onBtnExportDataAsCsv()}
            style={{ fontSize: '12px' }}
          >
            Exportar a CSV
          </Button>
        </div>
        <Nav tabs>
          {props.p_grouptables.map(element => {
            return (
              <NavItem>
                <NavLink
                  className={(activeTab === element.position_table ? "activeTab baseTab" : "baseTab")}
                  onClick={() => changeTab(element.position_table)}>
                  {element.description}
                </NavLink>
              </NavItem>
            )
          })
          }
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
                  //suppressColumnVirtualisation={true}
                  defaultColDef={defColumnDefs}
                  pagination={true}
                  paginationPageSize={100}
                  onRowDataChanged={onRowDataChanged}
                  rowHeight={30}
                  onGridReady={onGridReady}
                  onFilterChanged={onFilterChanged} 
                  //onBodyScroll={columnVisible}
                />
              </div>
            </TabPane>
          ))}
        </TabContent>
      </div>
      <div className='chart' style={{ display:'inline' }}>
        {listChart.map((chartData) => {
          return chartData && chartData?.p_data && (
            <div>
            <div className='subchart'>
              <Chart
                type={chartData.p_tipo}
                chartData={chartData}
              />
            </div>
            {/*<div>
            <BarChart
              data = {chartData.p_data}
              xField = {chartData.p_categoria}
              yFields = {chartData.p_valor} />
            </div>*/}
            </div>) 
        })}
      </div>
    </div>
  );
}

export default AgGrid;
