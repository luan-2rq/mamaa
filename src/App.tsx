import './App.css'

import { Outlet } from 'react-router-dom'
import NavBar from './components/organisms/NavBar';
import Chart from './components/Chart';

function App() {

  return (
    <div className="App">
      <NavBar />
      <Chart />
      <Outlet />
    </div>
  );
}

export default App
