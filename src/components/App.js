import React from 'react';
import {version} from '../../package.json';
import AppMain from './AppMain';

const App = ({children}) => (
  <div>
    <header>
      <img className="logo" src="../../images/GenericLogo2.png"></img>
    </header>
    <section>
      <AppMain/>
    </section>
  </div>
);

export default App;
