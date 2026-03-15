import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../state/authStore';
import LandingLayout from '../../layouts/LandingLayout';
import HeroSection from '../../components/landing/HeroSection';
import ServicesSection from '../../components/landing/ServicesSection';
import FeaturesSection from '../../components/landing/FeaturesSection';
import HowItWorksSection from '../../components/landing/HowItWorksSection';
import InstallAppSection from '../../components/landing/InstallAppSection';
import TestimonialsSection from '../../components/landing/TestimonialsSection';
import CallToActionSection from '../../components/landing/CallToActionSection';

export default function LandingPage() {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is already logged in, redirect straight to dashboard
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <LandingLayout>
      <HeroSection />
      <ServicesSection />
      <FeaturesSection />
      <HowItWorksSection />
      <InstallAppSection />
      <TestimonialsSection />
      <CallToActionSection />
    </LandingLayout>
  );
}
