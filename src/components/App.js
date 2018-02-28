import React from 'react';
import AppMain from './AppMain';
import logo from '../images/AtmosLogo.png';
import '../styles/main.css';

const App = ({children}) => (
  <div>
    <header>
    </header>
    <section>
      <img className="logo" src={logo} alt={"Could not load logo"} />
      <AppMain/>
    </section>
  </div>
);

export default App;
