import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AppContextProvider } from './contexts/AppContext';
import reportWebVitals from './reportWebVitals';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Web3Container } from 'react-web3-hook';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Web3Container>
        <AppContextProvider>
          <App />
        </AppContextProvider>
      </Web3Container>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
