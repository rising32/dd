import React from 'react';
import { Range, getTrackBackground } from 'react-range';
import { IRenderTrackParams } from 'react-range/lib/types';

interface Props {
  values: number[];
  onSetValue: (values: number[]) => void;
}
function MultiRangeSlider({ values, onSetValue }: Props) {
  const STEP = 1;
  const MIN = 0;
  const MAX = 24;

  return (
    <div>
      {/* <Range
        draggableTrack
        values={values}
        step={STEP}
        min={MIN}
        max={MAX}
        onChange={values => {
          onSetValue(values);
        }}
        renderTrack={({ props, children }: IRenderTrackParams) => (
          <div
            onMouseDown={props.onMouseDown}
            onTouchStart={props.onTouchStart}
            className='w-full h-8 flex'
            style={{
              ...props.style,
            }}
          >
            <div
              ref={props.ref}
              className='h-2 w-full rounded-md'
              style={{
                background: getTrackBackground({
                  values,
                  colors: ['#ccc', '#548BF4', '#ccc'],
                  min: MIN,
                  max: MAX,
                }),
                alignSelf: 'center',
              }}
            >
              {children}
            </div>
          </div>
        )}
        renderThumb={({ props, isDragged }) => (
          <div
            {...props}
            className='w-6 h-6 rounded-full border-2 border-white flex items-center justify-center shadow-md'
            style={{
              ...props.style,
              backgroundColor: isDragged ? '#548BF4' : '#C4C4C4',
            }}
          />
        )}
      /> */}
    </div>
  );
}

export default MultiRangeSlider;
