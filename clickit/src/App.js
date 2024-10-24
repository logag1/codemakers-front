import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Main from './components/Main';
import Game from './components/Game';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/game" element={<Game />} />
        </Routes>
      </Router>
    );
  }
}

export default App;