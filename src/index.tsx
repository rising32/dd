import React, { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';

import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

function AppWithCallbackAfterRender() {
  useEffect(() => {
    console.log('rendered');
  });

  return (
    <StrictMode>
      <BrowserRouter>
        <Provider store={store}>
          <App />
        </Provider>
      </BrowserRouter>
    </StrictMode>
  );
}

const container = document.getElementById('root');
const root = createRoot(container as HTMLElement);
root.render(<AppWithCallbackAfterRender />);

reportWebVitals();
