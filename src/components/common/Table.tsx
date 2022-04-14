import React, { useState } from 'react';
import { Column, useTable } from 'react-table';
import { TableDataState } from '../../modules/setting';
export interface Props {
  columns: Array<Column<any>>;
  data: Array<any>;
}
const Table = ({ columns, data }: Props) => {
  const [seletedRowId, setSelectedRowId] = React.useState('');
  const { getTableProps, getTableBodyProps, headers, rows, prepareRow } = useTable({
    columns,
    data,
  });
  const onClickRow = (rowId: string) => {
    setSelectedRowId(seletedRowId => (seletedRowId === rowId ? '' : rowId));
  };

  return (
    <table {...getTableProps()} className='flex flex-col'>
      <thead className='flex flex-row'>
        {headers.map(column => (
          <tr
            {...column.getHeaderProps()}
            key={column.getHeaderProps()['key']}
            className='bg-background flex flex-1 flex-col py-2 items-center justify-center outline outline-1 outline-white'
          >
            {column
              .render('Header')
              ?.toString()
              .split('')
              .reverse()
              .map((item, index) => (
                <th key={index} className=' content-center' style={{ lineHeight: 0.7 }}>
                  <span className='-rotate-90 text-white flex items-center justify-center'>{item}</span>
                </th>
              ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()} className='flex flex-col'>
        {rows.map((row, i) => {
          prepareRow(row);
          return (
            <tr
              {...row.getRowProps()}
              key={row.getRowProps()['key']}
              className='flex divide-x divide-y divide-light-gray'
              style={{ borderStyle: 'solid', borderWidth: seletedRowId === row.id ? 1 : 0, borderColor: '#DD0000' }}
            >
              {row.cells.map(cell => {
                return (
                  <td
                    {...cell.getCellProps()}
                    key={cell.getCellProps()['key']}
                    className='flex flex-1 justify-center items-center'
                    style={{
                      background: cell.row.id === '0' ? '#C4C4C4' : 'white',
                    }}
                    onClick={() => onClickRow(cell.row.id)}
                  >
                    {cell.column.id === 'week' || cell.column.id === 'month' ? (
                      <div className='text-white bg-background flex flex-1 items-center justify-center p-1'>
                        <div className='text-white'>{cell.render('Cell')}</div>
                      </div>
                    ) : (
                      <div className='text-black'>{cell.render('Cell')}</div>
                    )}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default Table;
