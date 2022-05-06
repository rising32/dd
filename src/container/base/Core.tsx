import React from 'react';
import { ToastContainer } from 'react-toastify';
import { injectStyle } from 'react-toastify/dist/inject-style';
import LoaderSpinner from './LoaderSpinner';

if (typeof window !== 'undefined') {
  injectStyle();
}

const Core = () => {
  return (
    <>
      <LoaderSpinner />
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
