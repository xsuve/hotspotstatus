import React, { Component } from 'react';

// Pages
import Home from './pages/Home';

class App extends Component {

  constructor() {
    super();

    this.state = {};
  }

  componentDidMount() {
    //
  }

  // Render
  render() {
    return (
      <Home />
    );
  }

}

export default App;
