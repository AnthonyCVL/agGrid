import './Appss.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

//importamos los comp creados
import App from './App';
import Metadatos from './Metadatos';
import Home from './components/home';
import NavBarExample from './NavBarExample';

function Appss() {
  return (
    <div className="App">

<BrowserRouter>
<Routes>
  <Route path='/' element={ <NavBarExample /> }>
    <Route index element={ <Home /> } />
    <Route path='app' element={ <App /> } />
    <Route path='Metadatos' element={ <Metadatos /> } />
    <Route path='*' element={ <Navigate replace to="/"/> }/>
  </Route>
</Routes> 
</BrowserRouter>

    </div>
  );
}

export default Appss;