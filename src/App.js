import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Header from './components/Header';


function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Signup/>} />
      <Route path='/dashboard'  element={<Dashboard/>} />
    </Routes>
    </BrowserRouter>
  );
}

export default App;
