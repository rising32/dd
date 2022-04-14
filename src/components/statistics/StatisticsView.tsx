import React, { useState } from 'react';
import PriorityView from '../priority/PriorityView';
import MainResponsive from '../../container/MainResponsive';
import WeelyStatus from '../common/WeelyStatus';
import { StatisticState } from '../../modules/statistic';
import StatisticsTable from './StatisticsTable';

function StatisticsView() {
  const [statisticType, setStatisticType] = useState<StatisticState>('week');
  const [statusValue, setStatusValue] = useState(70);
  const onSetStatisticType = (type: StatisticState) => {
    setStatisticType(type);
    setStatusValue(type === 'month' ? 70 : 35);
  };
  return (
    <>
      <WeelyStatus statisticType={statisticType} value={statusValue} onSetStatisticType={onSetStatisticType} />
      <StatisticsTable statisticType={statisticType} />
    </>
  );
}

export default StatisticsView;
