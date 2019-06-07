import React from 'react';
import './App.css';
import MainPage from './components/Main'
import BlankPage from './components/BlankPage'
import { Router, Route } from "react-router-dom"
import { history } from './components/history'

function App() {
  return (
    <div className="App">
      <Router history={history}>
        <Route path="/" exact component={MainPage} />
        <Route path="/blank" exact component={BlankPage} />
        <Route path="/about" exact component={MainPage} />
      </Router>
    </div>
  );
}

export default App;