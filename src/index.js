import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();


/*
- ReactDOM: creates root or enter point for our app, so ReactDOM.createRoot takes HTML element as an argument which we considered as a root, now this function will also return js object.

root.render(reactElement);

- root have render method which takes reactElement as argument, & converts it into HTML elements that the browser can display.
*/