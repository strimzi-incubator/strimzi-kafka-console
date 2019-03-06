import React, { Component } from 'react';
import '@patternfly/react-core/dist/styles/base.css';
import '@patternfly/patternfly/patternfly.css';
import './App.css';
import PageLayoutManualNav from './components/layout';

class App extends Component {
  state = {};

  render() {
    return (
      <div className="App">
        <PageLayoutManualNav />
      </div>
    );
  }
}

export default App;
