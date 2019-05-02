import React from 'react';
import './App.css';
import { GameBoard } from './game';

const App: React.FC = () => {
  return (
    <div className="App">
      <GameBoard />
    </div>
  );
}

export default App;
