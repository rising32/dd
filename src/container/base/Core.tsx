import React from 'react';
import { ToastContainer, Flip } from 'react-toastify';
import { injectStyle } from 'react-toastify/dist/inject-style';

if (typeof window !== 'undefined') {
  injectStyle();
}
const Core = () => {
  return (
    <>
      <ToastContainer
        position='top-right'
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
};

export default Core;
