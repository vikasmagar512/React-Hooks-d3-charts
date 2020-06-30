'use strict';

import React, { Component } from 'react';
import { render } from 'react-dom';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import './Table.css'
import data from './data.json'
export default class Table extends Component {
  constructor(props) {
    super(props);

    this.state = {
      columnDefs: [],
      defaultColDef: {
        flex: 1,
        minWidth: 150,
        sortable: true,
        resizable: true,
        filter: true,
      },
      autoGroupColumnDef: { minWidth: 250 },
      sideBar: 'columns',
      rowData: [],
    };
  }

  onGridReady = params => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    const updateData = data => {
      this.setState({ rowData: data });
    };
    let columnDefs = Object.keys(data[0]).map((col, i) => {
      console.log(data[0][col])

      debugger
      return {
        field: col,
        enableRowGroup: true,
        enablePivot: true,
        ...((typeof (data[0][col]) === 'number') ? {
          filter: 'agNumberColumnFilter',
          aggFunc: 'sum'
        } : {
            ...(col.toLowerCase() !== 'date' ? {
              filter: 'agTextColumnFilter',
            } : {
                filter: 'agDateColumnFilter',
                filterParams: {
                  comparator: function (filterLocalDateAtMidnight, cellValue) {
                    var dateAsString = cellValue;
                    if (dateAsString == null) return -1;
                    var dateParts = dateAsString.split('/');
                    var cellDate = new Date(
                      Number(dateParts[2]),
                      Number(dateParts[1]) - 1,
                      Number(dateParts[0])
                    );
                    if (filterLocalDateAtMidnight.getTime() == cellDate.getTime()) {
                      return 0;
                    }
                    if (cellDate < filterLocalDateAtMidnight) {
                      return -1;
                    }
                    if (cellDate > filterLocalDateAtMidnight) {
                      return 1;
                    }
                  },
                  browserDatePicker: true,
                },
              }),
          })
      }
    })
    this.setState({ columnDefs })
    updateData(data);
  };

  onBtNormal = () => {
    this.gridColumnApi.setPivotMode(false);
  };

  onBtPivotMode = () => {
    this.gridColumnApi.setPivotMode(true);
  };

  onBtFullPivot = () => {
    this.gridColumnApi.setPivotMode(true);
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