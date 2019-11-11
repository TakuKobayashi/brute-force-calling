import React from 'react';
import logo from './brute-force-calling-logo.png';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          この番号に電話をかけてみてね!!
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          05031969521
        </a>
      </header>
    </div>
  );
}

export default App;
