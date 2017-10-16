import React, { Component } from 'react';
import './App.css';
import Restaurants from './Restaurants';

class App extends Component {
  render() {
    return (
      <div className="App">
        <h1>Welcome to Quijinn</h1>
        <Restaurants/>
      </div>
    );
  }
}

export default App;
