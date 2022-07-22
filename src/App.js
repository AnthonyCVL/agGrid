import './App.css';
import React, { useState } from 'react';
import AgGrid from './components/AgGrid';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

function App() {
  const state = callAPI();
  return (
    <div className="App">
      <AgGrid 
        elements = {callAPI()}/>
    </div>
  );
}

function callAPI() {
  fetch('http://localhost:8083/getTable').then(
      (response) => response.json()
  ).then((data) => {
      console.log(data)
      this.setState({
          list:data
      })
  })
}

export default App;
