import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Column } from 'react-table';
import { sendMonthStaticsticsData, sendWeekStaticsticsData } from '../../lib/api';
import useRequest from '../../lib/hooks/useRequest';
import { WeekWorkDay } from '../../modules/project';
import { StatisticState, TableHeader } from '../../modules/statistic';
import { RootState } from '../../store';
import Table from '../common/Table';

interface Props {
  statisticType: StatisticState;
}

function StatisticsTable({ statisticType }: Props): JSX.Element {
  const [_sendWeekStaticsticsData, , sendWeekStaticsticsDataRes] = useRequest(sendWeekStaticsticsData);
  const [_sendMonthStaticsticsData, , sendMonthStaticsticsDataRes] = useRequest(sendMonthStaticsticsData);
  const [weekTableData, setWeekTableData] = useState<any[]>([]);
  const [weekTableHeader, setWeekTableHeader] = useState<TableHeader[]>([]);
  const [monthTableHeader, setMonthTableHeader] = useState<TableHeader[]>([]);
  const [monthTableData, setMonthTableData] = useState<any[]>([]);
  const [loaded, setLoaded] = useState(false);

  const { userInfo } = useSelector((state: RootState) => state.user);
  React.useEffect(() => {
    if (statisticType === 'week' && weekTableData.length === 0) {
      setLoaded(false);
      const user_id = userInfo?.user_id;
      _sendWeekStaticsticsData(user_id);
    }
    if (statisticType === 'month' && monthTableData.length === 0) {
      setLoaded(false);
      const user_id = userInfo?.user_id;
      _sendMonthStaticsticsData(user_id);
    }
  }, [statisticType]);
  React.useEffect(() => {
    if (sendWeekStaticsticsDataRes && sendWeekStaticsticsDataRes.data.length > 0) {
      const newHeader = weekTableHeader;
      const newData = weekTableData;
      sendWeekStaticsticsDataRes.data.map(item => {
        if (item.client_id === -1) {
          const WeekWeekHeader: TableHeader = {
            Header: 'WEEKS',
            accessor: 'week',
          };
          const WeekAvailableHeader: TableHeader = {
            Header: item.client_name,
            accessor: item.client_name.toLowerCase().replace(/\s+/g, ''),
          };
          const WeekDeltaColumn: TableHeader = {
            Header: 'Delta',
            accessor: 'delta',
          };
          const WeekTotalColumn: TableHeader = {
            Header: 'TOTAL',
            accessor: 'total',
          };
          newHeader.push(WeekWeekHeader);
          newHeader.push(WeekAvailableHeader);
          newHeader.push(WeekDeltaColumn);
          newHeader.push(WeekTotalColumn);
        } else {
          const HeaderItem: TableHeader = {
            Header: item.client_name,
            accessor: item.client_name.toLowerCase().replace(/\s+/g, ''),
          };
          newHeader.push(HeaderItem);
        }
      });
      setWeekTableHeader(newHeader);
      const ItemsSum: any = {};
      sendWeekStaticsticsDataRes.data.map(item => {
        const dataKey = item.client_name.toLowerCase().replace(/\s+/g, '');
        let sumValue = 0;
        item.realWorkdays.length > 0 &&
          item.realWorkdays.map((cell: WeekWorkDay) => {
            sumValue += cell.work_days;
          });
        ItemsSum[`${dataKey}`] = sumValue;
      });
      let total = 0;
      let delta = 0;
      for (const [key, value] of Object.entries(ItemsSum)) {
        if (key !== 'available') {
          total += value as number;
        }
      }
      delta = ItemsSum['available'] - total;
      for (let i = 0; i <= 52; i++) {
        const tableDataItem: any = {};
        sendWeekStaticsticsDataRes.data.map(item => {
          if (item.realWorkdays.length > 0) {
            const dataKey = item.client_name.toLowerCase().replace(/\s+/g, '');
            tableDataItem[`${dataKey}`] = i === 0 ? ItemsSum[`${dataKey}`] : item.realWorkdays[i - 1].work_days;
          }
          tableDataItem['week'] = i === 0 ? 'Σ' : i;
        });
        let totaItem = 0;
        let deltaItem = 0;
        for (const [key, value] of Object.entries(tableDataItem)) {
          if (key !== 'available' && key !== 'week') {
            totaItem += value as number;
          }
        }
        deltaItem = tableDataItem['available'] - totaItem;

        if (i === 0) {
          tableDataItem['delta'] = delta;
          tableDataItem['total'] = total;
        } else {
          tableDataItem['delta'] = deltaItem;
          tableDataItem['total'] = totaItem;
        }

        newData.push(tableDataItem);
      }
      setWeekTableData(newData);
      setLoaded(true);
    }
  }, [sendWeekStaticsticsDataRes]);
  React.useEffect(() => {
    if (sendMonthStaticsticsDataRes && sendMonthStaticsticsDataRes.data.length > 0) {
      const newHeader = monthTableHeader;
      const newData = monthTableData;
      sendMonthStaticsticsDataRes.data.map(item => {
        if (item.client_id === -1) {
          const MonthWeekHeader: TableHeader = {
            Header: 'MONTHS',
            accessor: 'month',
          };
          const WeekAvailableHeader: TableHeader = {
            Header: item.client_name,
            accessor: item.client_name.toLowerCase().replace(/\s+/g, ''),
          };
          const WeekDeltaColumn: TableHeader = {
            Header: 'Delta',
            accessor: 'delta',
          };
          const WeekTotalColumn: TableHeader = {
            Header: 'TOTAL',
            accessor: 'total',
          };
          newHeader.push(MonthWeekHeader);
          newHeader.push(WeekAvailableHeader);
          newHeader.push(WeekDeltaColumn);
          newHeader.push(WeekTotalColumn);
        } else {
          const HeaderItem: TableHeader = {
            Header: item.client_name,
            accessor: item.client_name.toLowerCase().replace(/\s+/g, ''),
          };
          newHeader.push(HeaderItem);
        }
      });
      setMonthTableHeader(newHeader);
      const ItemsSum: any = {};
      sendMonthStaticsticsDataRes.data.map(item => {
        const dataKey = item.client_name.toLowerCase().replace(/\s+/g, '');
        let sumValue = 0;
        item.realWorkdays.length > 0 &&
          item.realWorkdays.map(cell => {
            sumValue += cell.work_days;
          });
        ItemsSum[`${dataKey}`] = sumValue;
      });
      let total = 0;
      let delta = 0;
      for (const [key, value] of Object.entries(ItemsSum)) {
        if (key !== 'available') {
          total += value as number;
        }
      }
      delta = ItemsSum['available'] - total;
      const MonthLabel = ['Σ', 'J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
      for (let i = 0; i <= 12; i++) {
        const tableDataItem: any = {};
        sendMonthStaticsticsDataRes.data.map(item => {
          if (item.realWorkdays.length > 0) {
            const dataKey = item.client_name.toLowerCase().replace(/\s+/g, '');
            tableDataItem[`${dataKey}`] = i === 0 ? ItemsSum[`${dataKey}`] : item.realWorkdays[i - 1].work_days;
          }
          tableDataItem['month'] = MonthLabel[i];
        });
        let totaItem = 0;
        let deltaItem = 0;
        for (const [key, value] of Object.entries(tableDataItem)) {
          if (key !== 'available' && key !== 'month') {
            totaItem += value as number;
          }
        }
        deltaItem = tableDataItem['available'] - totaItem;

        if (i === 0) {
          tableDataItem['delta'] = delta;
          tableDataItem['total'] = total;
        } else {
          tableDataItem['delta'] = deltaItem;
          tableDataItem['total'] = totaItem;
        }

        newData.push(tableDataItem);
      }
      setMonthTableData(newData);
      setLoaded(true);
    }
  }, [sendMonthStaticsticsDataRes]);
  const weekColumns: Array<Column<any>> = useMemo(() => weekTableHeader, [weekTableHeader]);
  const weekData: Array<any> = useMemo(() => weekTableData, [weekTableData]);
  const monthColumns: Array<Column<any>> = useMemo(() => monthTableHeader, [monthTableHeader]);
  const monthData: Array<any> = useMemo(() => monthTableData, [monthTableData]);

  return (
    <div className='mt-4 text-center'>
      {statisticType === 'week' && <span className=''>My Production</span>}
      {statisticType === 'month' && <span className=''>My forecast</span>}
      {loaded && (
        <div className='outline outline-1 outline-white shadow-xl w-full'>
          {statisticType === 'week' ? <Table columns={weekColumns} data={weekData} /> : <div />}
          {statisticType === 'month' ? <Table columns={monthColumns} data={monthData} /> : <div />}
        </div>
      )}
    </div>
  );
}

export default StatisticsTable;
