import React, { useEffect, useRef, useState } from 'react';
import { useSpring, animated } from 'react-spring';

interface Props {
  show: boolean;
  className?: string;
  children: React.ReactNode;
}

function AnimatedView({ show, className, children }: Props): JSX.Element {
  const ref = useRef<HTMLDivElement>(null);

  const [style, api] = useSpring(() => ({ height: '0px' }), []);

  useEffect(() => {
    api.start({
      height: (show ? ref.current?.offsetHeight : 0) + 'px',
    });
  }, [api, ref, show]);

  return (
    <animated.div
      style={{
        ...style,
        overflow: 'hidden',
      }}
    >
      <div ref={ref} className={className}>
        {children}
      </div>
    </animated.div>
  );
}

export default AnimatedView;
