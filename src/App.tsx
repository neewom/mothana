import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { Layout } from './components/layout/Layout';
import { UsersPage } from './pages/UsersPage';
import { DonationsPage } from './pages/DonationsPage';

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/users" replace />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/donations" element={<DonationsPage />} />
        </Routes>
      </Layout>
      <Toaster />
    </BrowserRouter>
  );
}
