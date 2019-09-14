import React from 'react';
import './App.css';
import AutoComplete from  './components/autoComplete/AutoComplete'

function App() {
  return (
    <div className="App">
      <AutoComplete maxAllowedSearch={5}/>
    </div>
  );
}

export default App;
