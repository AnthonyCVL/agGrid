'use strict';

import React, { Component } from 'react';
import { render } from 'react-dom';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

import '../stylesheet/Grid.css';

class Grid extends Component {
  constructor(props) {
    super(props);

    this.state = {
      columnDefs: [
        { field: 'athlete', width: 150, suppressSizeToFit: true },
        {
          field: 'age',
          headerName: 'Age of Athlete',
          width: 90,
          minWidth: 50,
          maxWidth: 150,
        },
        { field: 'country', width: 120 },
        { field: 'year', width: 90 },
        { field: 'date', width: 110 },
        { field: 'sport', width: 110 },
        { field: 'gold', width: 100 },
        { field: 'silver', width: 100 },
        { field: 'bronze', width: 100 },
        { field: 'total', width: 100 },
      ],
      defaultColDef: {
        resizable: true,
      },
      rowData: null,
    };
  }

  
  onGridReady = (params) => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    const updateData = (data) => params.api.setRowData(data);
    
    fetch('https://www.ag-grid.com/example-assets/olympic-winners.json')
      .then((resp) => resp.json())
      .then((data) => updateData(data));
  };

  onColumnResized = (params) => {
    console.log(params);
  };

  sizeToFit = () => {
    this.gridApi.sizeColumnsToFit();
  };

  autoSizeAll = (skipHeader) => {
    const allColumnIds = [];
    this.gridColumnApi.getAllGridColumns().forEach((column) => {
      allColumnIds.push(column.getId());
    });
    this.gridColumnApi.autoSizeColumns(allColumnIds, skipHeader);
  };

  render() {
    return (
      <div style={{ width: '100%', height: '1000px' }}>
        <div className="outer-div">
          <div className="button-bar">
            <button onClick={() => this.sizeToFit()}>Size to Fit</button>
            <button onClick={() => this.autoSizeAll(false)}>
              Auto-Size All
            </button>
            <button onClick={() => this.autoSizeAll(true)}>
              Auto-Size All (Skip Header)
            </button>
          </div>
          <div className="grid-wrapper">
            <div
              style={{
                height: '100%',
                width: '100%',
              }}
              className="ag-theme-alpine"
            >
              <AgGridReact
                columnDefs={this.state.columnDefs}
                defaultColDef={this.state.defaultColDef}
                rowData={this.state.rowData}
                onGridReady={this.onGridReady}
                onColumnResized={this.onColumnResized.bind(this)}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

render(<Grid></Grid>, document.querySelector('#root'));


export default Grid;