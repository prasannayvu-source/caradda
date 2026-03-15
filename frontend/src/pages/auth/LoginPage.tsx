import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../../layouts/AuthLayout';
import LoginForm from '../../components/auth/LoginForm';
import { useAuthStore } from '../../state/authStore';

export default function LoginPage() {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to your CAR ADDA dashboard to manage billing, customers, and inventory."
    >
      <LoginForm />
    </AuthLayout>
  );
}
