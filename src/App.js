import logo from './logo.svg';
import './App.css';
import Login from './Components/Login';
import Transporter from './Components/Transporter';
import Manufacturer from './Components/Manufacturer';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
function App() {
  return (
   
    <div className="App">
   <Routes>
    <Route path="/" exact element={<Login/>} />
    <Route path="/Transporter" element={<Transporter/>} />
    <Route path="/Manufacturer" element={<Manufacturer/>} />
    </Routes>
     
    </div>
   
  );
}

export default App;
