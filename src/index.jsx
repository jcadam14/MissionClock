/**import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import MissionClockApp from './MissionClockApp';
  // ========================================
  
  ReactDOM.render(
    <MissionClockApp />,
    document.getElementById('root')
  );

  if(module.hot){
    module.hot.accept();
  }
  */

 import React from "react"; 
 import { render } from "react-dom"; 
 import { Provider } from "react-redux"; 
 import store from "./store/index"; 
 import ConnectedMC from './ConnectedMC';
 import Bootstrap from 'bootstrap/dist/css/bootstrap.css';
 import 'react-datetime/css/react-datetime.css';


render(
  <Provider store={store}>
    <ConnectedMC/>
  </Provider>,
  document.getElementById('root')
);

if(module.hot){
  module.hot.accept();
}