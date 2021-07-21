import React, { useState } from 'react'
import './stylesheets/App.scss';
import { Main } from './components/Main';
import { Provider } from './context/State';
import { Switch } from "@material-ui/core";

function App() {
  const [theme, setTheme] = useState(localStorage.getItem('ptp-theme') || 'light')

  const toggleTheme = () => {
    if (theme === "light") {
      localStorage.setItem('ptp-theme', 'dark');
      setTheme('dark');
    }
    else {
      setTheme('light');
      localStorage.setItem('ptp-theme', 'light');
    }
  }

  return (
    <div className={`app ${theme}`}>
      <div className="header">
        <div className="logo theme-font-color">
          <h1>PETER</h1>
          <h3>-THE-</h3>
          <h1>PARKER</h1>
        </div>
        <div className="theme-switch theme-font-color">
          <h3>Light</h3>
          <Switch 
            checked={theme === 'dark'}
            color="primary"
            name="theme"
            onChange={toggleTheme}
          />
          <h3>Dark</h3>
        </div>
      </div>
      <Provider>
        <Main />
      </Provider>
    </div>
  );
}

export default App;
