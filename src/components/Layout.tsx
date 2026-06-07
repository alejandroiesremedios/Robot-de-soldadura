import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';
import TopBar from './TopBar';

export default function Layout() {
  return (
    <div className="min-h-full flex flex-col">
      <TopBar />
      <main className="flex-1 pb-24 px-4 pt-4 max-w-2xl mx-auto w-full">
        <Outlet />
      </main>
      <NavBar />
    </div>
  );
}
