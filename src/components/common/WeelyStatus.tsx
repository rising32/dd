import React, { useEffect, useRef, useState } from 'react';
import { useSpring, animated } from 'react-spring';
import useMeasure from 'react-use-measure';
import { StatisticState } from '../../modules/statistic';

interface Props {
  value: number;
  statisticType: StatisticState;
  onSetStatisticType: (type: StatisticState) => void;
}

function WeelyStatus({ value, statisticType, onSetStatisticType }: Props): JSX.Element {
  const [open, toggle] = useState(true);
  const [ref, { width }] = useMeasure();
  const props = useSpring({ width: open ? (width * value) / 100 : 0 });

  return (
    <div ref={ref} className='relative w-full py-4 bg-white rounded-md flex flex-row justify-between items-center px-4'>
      <animated.div className='absolute top-0 left-0 w-full h-full bg-dark-gray rounded-md' style={props} />
      <animated.div className='absolute top-0 left-0 w-full h-full flex items-center justify-center text-black'>
        {'WEEKLY STATUS ' + value + ' %'}
      </animated.div>
      {statisticType === 'month' ? (
        <span className='text-rouge-blue font-bold z-10' onClick={() => onSetStatisticType('week')}>
          Week
        </span>
      ) : (
        <div />
      )}
      {statisticType === 'week' ? (
        <span className='text-rouge-blue font-bold z-10' onClick={() => onSetStatisticType('month')}>
          Month
        </span>
      ) : (
        <div />
      )}
    </div>
  );
}

export default WeelyStatus;
