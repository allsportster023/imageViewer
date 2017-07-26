import React from 'react';
import {version} from '../../package.json';
import AppMain from './AppMain';

const App = ({children}) => (
  <div>
    <header>
    </header>
    <section>
      <img className="logo" src="../../images/GenericLogo2.png"></img>
      <AppMain/>
    </section>
  </div>
);

export default App;
