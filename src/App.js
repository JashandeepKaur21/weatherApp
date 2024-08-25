import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import WeatherComponent from './components/WeatherApp'
import './App.css'; 
import backgroundImage from './assets/images/background.jpg'; 


function App() {
  return (
    <div className="app-container" style={{ backgroundImage: `url(${backgroundImage})` }}>
          <BrowserRouter>
      <Routes>
        <Route path="/" element={<WeatherComponent />} /> 
      </Routes>
    </BrowserRouter>
    </div>



  );
}

export default App;
