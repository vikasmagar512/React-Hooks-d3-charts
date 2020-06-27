'use strict';

import React, { Component } from 'react';
import { render } from 'react-dom';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import './Table.css'
export default class Table extends Component {
  constructor(props) {
    super(props);

    this.state = {
      columnDefs: [
        {
          field: 'country',
          rowGroup: true,
          enableRowGroup: true,
        },
        {
          field: 'year',
          rowGroup: true,
          enableRowGroup: true,
          enablePivot: true,
        },
        { field: 'date' },
        { field: 'sport' },
        {
          field: 'gold',
          aggFunc: 'sum',
        },
        {
          field: 'silver',
          aggFunc: 'sum',
        },
        {
          field: 'bronze',
          aggFunc: 'sum',
        },
      ],
      defaultColDef: {
        flex: 1,
        minWidth: 150,
        sortable: true,
        resizable: true,
      },
      autoGroupColumnDef: { minWidth: 250 },
      sideBar: 'columns',
      rowData: [],
    };
  }

  onGridReady = params => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    const httpRequest = new XMLHttpRequest();
    const updateData = data => {
      this.setState({ rowData: data });
    };

    httpRequest.open(
      'GET',
      'https://raw.githubusercontent.com/ag-grid/ag-grid/master/grid-packages/ag-grid-docs/src/olympicWinners.json'
    );
    httpRequest.send();
    httpRequest.onreadystatechange = () => {
      if (httpRequest.readyState === 4 && httpRequest.status === 200) {
        updateData(JSON.parse(httpRequest.responseText));
      }
    };
  };

  onBtNormal = () => {
    this.gridColumnApi.setPivotMode(false);
    this.gridColumnApi.setPivotColumns([]);
    this.gridColumnApi.setRowGroupColumns(['country', 'year']);
  };

  onBtPivotMode = () => {
    this.gridColumnApi.setPivotMode(true);
    this.gridColumnApi.setPivotColumns([]);
    this.gridColumnApi.setRowGroupColumns(['country', 'year']);
  };

  onBtFullPivot = () => {
    this.gridColumnApi.setPivotMode(true);
    this.gridColumnApi.setPivotColumns(['year']);
    this.gridColumnApi.setRowGroupColumns(['country']);
  };

  render() {
    return (
      <div style={{ width: '100%', height: '660px' }}>
        <div className="example-wrapper">
          <div style={{ marginBottom: '5px' }}>
            <button onClick={() => this.onBtNormal()}>
              1 - Grouping Active
            </button>
            <button onClick={() => this.onBtPivotMode()}>
              2 - Grouping Active with Pivot Mode
            </button>
            <button onClick={() => this.onBtFullPivot()}>
              3 - Grouping Active with Pivot Mode and Pivot Active
            </button>
          </div>

          <div
            id="myGrid"
            style={{
              height: '100%',
              width: '100%',
            }}
            className="ag-theme-alpine"
          >
            <AgGridReact
              columnDefs={this.state.columnDefs}
              defaultColDef={this.state.defaultColDef}
              autoGroupColumnDef={this.state.autoGroupColumnDef}
              sideBar={this.state.sideBar}
              onGridReady={this.onGridReady}
              rowData={this.state.rowData}
            />
          </div>
        </div>
      </div>
    );
  }
}