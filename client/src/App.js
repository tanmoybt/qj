import React, { Component } from 'react';
import Restaurants from './Components/Restaurants';

class App extends Component {
  render() {
    return (
      <div className="App container-fluid">
        <Restaurants/>
      </div>
    );
  }
}

export default App;
