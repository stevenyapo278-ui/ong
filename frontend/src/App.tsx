import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './layouts/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CreatePost from './pages/CreatePost';
import EditPost from './pages/EditPost';
import BlogHome from './pages/BlogHome';
import BlogList from './pages/BlogList';
import PostDetail from './pages/PostDetail';
import ForceChangePassword from './pages/ForceChangePassword';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import DonorsSpace from './pages/DonorsSpace';
import PartnersSpace from './pages/PartnersSpace';
import ScrollToTop from './components/ScrollToTop';
import { useAuth } from './context/AuthContext';

const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-gray-500">
        Chargement...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Force password change before accessing any protected page
  if (user.mustChangePassword) {
    return <Navigate to="/change-password" replace />;
  }

  return children;
};

function App() {
  return (
    <Layout>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/espace-donateur" element={<DonorsSpace />} />
        <Route path="/espace-partenaires" element={<PartnersSpace />} />
        <Route path="/blog" element={<BlogHome />} />
        <Route path="/actualites" element={<BlogList />} />
        <Route path="/actualites/:slug" element={<PostDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/change-password" element={<ForceChangePassword />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-post"
          element={
            <ProtectedRoute>
              <CreatePost />
            </ProtectedRoute>
          }
        />
        <Route
          path="/posts/:id/edit"
          element={
            <ProtectedRoute>
              <EditPost />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Layout>
  );
}

export default App;
