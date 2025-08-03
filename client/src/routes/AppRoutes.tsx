import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import LoginPage from "../features/auth/LoginPage";
import Header from "../components/Header";
import RegisterWithTokenPage from "../features/auth/RegisterWithTokenPage";
import { useAppSelector } from "../app/hooks";
import InvitePage from "../features/hr/InvitePage";
import OnboardingPage from "../features/onboarding/OnboardingPage";

const AppRoutes = () => {
  const { user } = useAppSelector((state) => state.auth);
  const location = useLocation();

  const isAuthPage =
    location.pathname.startsWith("/login") ||
    location.pathname.startsWith("/register");

  return (
    <>
      {user && !isAuthPage && <Header />}

      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register/:token" element={<RegisterWithTokenPage />} />
        <Route path="/hr" element={<InvitePage />} />
        <Route path="/onboard" element={<OnboardingPage />} />

        {/* Protected routes */}
        {user ? (
          <>
            
          </>
        ) : (
          <Route path="*" element={<Navigate to="/login" replace />} />
        )}
      </Routes>
    </>
  );
};

export default AppRoutes