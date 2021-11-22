import { FC } from 'react';
import Footer from '../components/Footer';
import NavBar from '../components/NavBar';

const MainLayout: FC = ({ children }) => {
  return (
    <div className='d-flex flex-column flex-fill'>
      <NavBar />
      <div
        className='container flex-grow-1 d-flex flex-column overflow-auto'
        style={{ height: 0 }}
      >
        {children}
      </div>
      <Footer />
    </div>
  );
};

export default MainLayout;
