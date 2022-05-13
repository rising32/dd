import React from 'react';

const Checkbox = ({ children, ...props }: JSX.IntrinsicElements['input']) => (
  <label style={{ marginRight: '1em' }}>
    <input type='checkbox' {...props} />
    {children}
  </label>
);

export default Checkbox;
