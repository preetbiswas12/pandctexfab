import { Outlet } from 'react-router';
import ScrollToTop from './components/ScrollToTop';
import { AdminProvider } from './context/AdminContext';
import { AppProvider } from './context/AppContext';

export default function RootLayout() {
  return (
    <>
      <ScrollToTop />
      <AdminProvider>
        <AppProvider>
          <Outlet />
        </AppProvider>
      </AdminProvider>
    </>
  );
}