import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import CacheBuster from 'react-cache-buster';
import packageInfo from '../package.json';
import { TwoWayContext } from './context/TwoWayContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  <BrowserRouter>
    <TwoWayContext>
      <CacheBuster
        currentVersion={packageInfo.version}
        isEnabled={true} //If false, the library is disabled.
        isVerboseMode={true} //If true, the library writes verbose logs to console.
        metaFileDirectory={'.'} //If public assets are hosted somewhere other than root on your server.
      ><App />
      </CacheBuster>
    </TwoWayContext>
  </BrowserRouter>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
