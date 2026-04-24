import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';
import { Layout } from './components/Layout';

// Features
import AuthScreen from './pages/AuthScreen';
import Dashboard from './pages/Dashboard';
import CreateIntent from './pages/CreateIntent';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { apiKey } = useAuthStore();
  if (!apiKey) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<AuthScreen />} />
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="create-intent" element={<CreateIntent />} />
        {/* Further routes will be added incrementally */}
      </Route>
    </Routes>
  );
}
