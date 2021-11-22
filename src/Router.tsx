import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Registration from './pages/Registration';

const Router = () => {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/registration' element={<Registration />} />
    </Routes>
  );
};

export default Router;
