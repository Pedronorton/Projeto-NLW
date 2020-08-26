import React from 'react';
import ReactDOM from 'react-dom'; // aqui eu digo que o rect será utilizado na web
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root') // estou falando para ele renderizar o componente App na id root 
);


