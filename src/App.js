import logo from './logo.svg';
import './App.scss';
import { Main } from './components/Main';
import { Provider } from './context/State';

function App() {
  return (
    <div className="App">
      <Provider>
        <Main />
      </Provider>
    </div>
  );
}

export default App;
