import './App.css'

import { Outlet } from 'react-router-dom'
import Home from './components/pages/Home.tsx'
import NavBar from './components/organisms/NavBar';

function App() {

  return (
    <div className="App">
        <NavBar />
        <Home />
        <Outlet />
    </div>
  );
}

export default App
