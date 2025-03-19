import { Outlet } from 'react-router-dom';
import Header from './Header';

const MainLayout = () => {
    return (
      <div className="max-w-full flex flex-col h-screen  bg-custom-gradient dark:bg-neutral-900" >
        <Header />
        <div className="flex-1 overflow-auto p-2">
          <Outlet />
        </div>
      </div>
    );
  };

export default MainLayout;