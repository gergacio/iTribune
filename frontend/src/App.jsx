import { Route, Routes, BrowserRouter } from 'react-router-dom';

import MainWrapper from './layouts/MainWrapper';
import PrivateRoutes from './layouts/PrivateRoute';

import Register from '../src/views/auth/Register';
import Login from '../src/views/auth/Login';
import Logout from './views/auth/Logout';


function App() {
  return (
    <BrowserRouter>
          { /* check user for auth */}
      <MainWrapper>
      
        { /* pass children, create urls */} 
        <Routes>
          <Route path='/register/' element={<Register />} />
          <Route path='/login/' element={<Login />} />    
          <Route path='/logout/' element={<Logout />} />    
        </Routes>
      </MainWrapper>
    </BrowserRouter>
  )
 
}

export default App
