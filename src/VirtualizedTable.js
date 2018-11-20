import React, { Component } from 'react';
import { InfiniteLoader, WindowScroller, AutoSizer, Column, Table, SortDirection, SortIndicator } from 'react-virtualized';

import 'react-virtualized/styles.css';

export default class VirtualizedTable extends Component
{
  constructor(props) {
    super(props);
    // console.log('VirtualizedTable constructor');
    // console.log(this.props);

    const { columns, rows } = this.props;

    // da tabella
    // . sortBy
    // . sortDirection
    // da singolo campo
    // . disableSort
    // . defaultSortDirection
    const sortBy = this.props.sortBy;
    const sortDirection = SortDirection[this.props.sortDirection || 'ASC'];
    const sortedRows = rows;

    this.state = {
      sortBy,
      sortDirection,

      columns,
      rows,
      sortedRows
    };

  }

  componentDidMount = () => {
    // console.log('componentDidMount');
    // console.log(this.props);

    this.initRows();
  };

  componentDidUpdate = prevProps => {
    // console.log('componentDidUpdate');
    // console.log(this.props);

    // if (!this.checkIfEqual(this.props.rows, this.state.rows)) {
    if (!this.checkIfEqual(prevProps.rows, this.props.rows)) {
      this.initRows();
    }
  };

  initRows = () => {
    const { sortBy, sortDirection } = this.state;
    const { rows } = this.props;
    this.setState({
      rows,
    }, function() {

      // const sortedRows = rows;
      const sortedRows = this.getSortedRows({sortBy, sortDirection});
      this.setState({
        sortedRows,
      });

    });
  };

  checkIfEqual = (a, b) => {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length != b.length) return false;

    for (var i = 0; i < a.length; ++i) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  };

  sortFn = ({sortBy, sortDirection}) => {
    const sortedRows = this.getSortedRows({sortBy, sortDirection});
    this.setState({
      sortedRows,
      sortBy,
      sortDirection,
    });
  };

  getSortedRows = ({sortBy, sortDirection}) => {
    const { columns, rows } = this.state;
    let sortedRows = rows;
    const column = columns.filter(column => column.dataKey===sortBy).shift();
    sortedRows.sort(function compare(a,b) {
      let aval, bval;
      if (typeof column.cellDataGetter === 'function') {
        aval = column.cellDataGetter({rowData: a});
        bval = column.cellDataGetter({rowData: b});
      } else {
        aval = a[sortBy];
        bval = b[sortBy];
      }
      if (aval < bval)
        return -1;
      if (aval > bval)
        return 1;
      return 0;
    });
    return sortDirection === SortDirection.DESC ? sortedRows.reverse() : sortedRows;
  };

  onRowsRendered = props => {
    // console.log('onRowsRendered');
    // console.log(props);
  };

  render() {
    // console.log('VirtualizedTable render');
    // console.log(this.props);

    const { rendererNoRows, rendererHeaderRow, rendererRow, headerHeight, rowHeight, rowClassName, headerClassName, disableHeader } = this.props;
    const { columns, rows, sortedRows, sortBy, sortDirection } = this.state;

    // const rowGetter = ({index}) => rows[index];
    // const rowGetter = ({index}) => sortedRows[index] || blankRow;
    const rowGetter = ({index}) => sortedRows[index];

    const rowCount = sortedRows.length;

    return (
      <AutoSizer>
        {({height, width}) => {
          return (
            <Table
              width={width}
              height={height}

              disableHeader={disableHeader}
              headerHeight={headerHeight}
              headerRowRenderer={rendererHeaderRow}
              rowHeight={rowHeight}
              rowRenderer={rendererRow}

              noRowsRenderer={rendererNoRows}
              rowCount={rowCount}
              rowGetter={rowGetter}
              headerClassName={headerClassName}
              rowClassName={rowClassName}

              sort={this.sortFn}
              sortBy={sortBy}
              sortDirection={sortDirection}
              onRowsRendered={this.onRowsRendered}
            >
              {Object.keys(columns).map((columnKey, index) => {
                return (
                  <Column
                    key={index}
                    {...columns[columnKey]}
                  />
                );
              })}
            </Table>
          )
        }}
      </AutoSizer>
    )
  }
}
