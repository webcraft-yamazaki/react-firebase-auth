import React from 'react';
import {BrowserRouter,Link,Routes,Route} from "react-router-dom";
import ReactDOM from 'react-dom/client';
import SignUp from './page/signup';
import Login from './page/login';
import Home from "./page/home";
import Service from "./page/service";
import reportWebVitals from './reportWebVitals';
import "./index.css"

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <div style={{ margin: '2em' }}>
      <BrowserRouter>
        <Routes>
          <Route path={`/`} element={<Home />} />
          <Route path={`/login`} element={<Login />} />
          <Route path={`/signup`} element={<SignUp />} />
          <Route path={`/service`} element={<Service />} />
        </Routes>
      </BrowserRouter>
    </div>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
