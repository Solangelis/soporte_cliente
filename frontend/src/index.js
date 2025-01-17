import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCheckCircle, faUsers, faChartLine, faBars } from '@fortawesome/free-solid-svg-icons';


library.add(faCheckCircle, faUsers, faChartLine, faBars);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
