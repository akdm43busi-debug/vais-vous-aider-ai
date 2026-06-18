import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { LoginPage } from './pages/Auth';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Members } from './pages/Members';
import { Contributions } from './pages/Contributions';
import { Meetings } from './pages/Meetings';
import { Reports } from './pages/Reports';
import { MemberSpace } from './pages/MemberSpace';
import { Settings } from './pages/Settings';
import { EconomicModel } from './pages/EconomicModel';
import Messages from './pages/Messages';
import { HelpCenter } from './pages/HelpCenter';
import { Subscriptions } from './pages/Subscriptions';
import { SuperAdmin } from './pages/SuperAdmin';

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" expand={true} richColors />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        {/* Admin/Treasurer Routes */}
        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
        <Route path="/members" element={<Layout><Members /></Layout>} />
        <Route path="/contributions" element={<Layout><Contributions /></Layout>} />
        <Route path="/meetings" element={<Layout><Meetings /></Layout>} />
        <Route path="/settings" element={<Layout><Settings /></Layout>} />
        <Route path="/finances" element={<Layout><EconomicModel /></Layout>} />
        <Route path="/messages" element={<Layout><Messages /></Layout>} />
        <Route path="/help" element={<Layout><HelpCenter /></Layout>} />
        <Route path="/messages" element={<Layout><Messages /></Layout>} />
        
        {/* Member Specific Routes */}
        <Route path="/member-space" element={<Layout><MemberSpace /></Layout>} />
        
        {/* Redirects */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
