import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import LoginPage from "../features/auth/LoginPage";
import Header from "../components/Header";
import RegisterWithTokenPage from "../features/auth/RegisterWithTokenPage";
import { useAppSelector } from "../app/hooks";
import OnboardingPage from "../features/onboarding/OnboardingPage";
import HiringManagementPage from "../features/hr/HiringManagementPage";
import EmployeeProfilesPage from "../features/hr/EmployeeProfilesPage";
import PersonalInformationPage from "../features/onboarding/PersonalInformationPage";
import VisaPage from "../features/visa/VisaPage";
import VisaManagementPage from "../features/hr/VisaStatusManagementPage";

const AppRoutes = () => {
  const { user } = useAppSelector((state) => state.auth);
  const onboardingStatus = useAppSelector(
    (state) => state.onboarding.data?.status
  );

  const location = useLocation();

  const isAuthPage =
    location.pathname.startsWith("/login") ||
    location.pathname.startsWith("/register");

  const isHR = user?.role === "HR";
  const isEmployeeApproved =
    user?.role === "EMPLOYEE" && onboardingStatus === "Approved";

  return (
    <>
      {user && !isAuthPage && <Header />}

      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register/:token" element={<RegisterWithTokenPage />} />

        {isHR && (
          <>
            <Route path="/hr" element={<EmployeeProfilesPage />} />
            <Route path="/hr/hiring" element={<HiringManagementPage />} />
            <Route path="/hr/visa" element={<VisaManagementPage />} />
          </>
        )}

        {isEmployeeApproved && (
          <>
            <Route
              path="/employee/personal"
              element={<PersonalInformationPage />}
            />
            <Route path="/visa" element={<VisaPage />} />
          </>
        )}
        
        {!isHR && (
          <>
            <Route path="/onboard" element={<OnboardingPage />} />
          </>
        )}

        {!user ? (
          <Route path="*" element={<Navigate to="/login" replace />} />
        ) : !isHR && !isEmployeeApproved ? (
          <Route path="*" element={<Navigate to="/onboard" replace />} />
        ) : (
          <Route path="*" element={<Navigate to="/" replace />} />
        )}
      </Routes>
    </>
  );
};

export default AppRoutes;
