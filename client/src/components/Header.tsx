import { NavLink, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { logout } from "../features/auth/authSlice";
import { Box, Breadcrumbs, Button, Typography } from "@mui/joy";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";

const Header: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const onboardingStatus = useAppSelector(
    (state) => state.onboarding.data?.status
  );
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  if (!user) return null;

  const isHR = user.role === "HR";
  const isEmployeeApproved =
    user?.role === "EMPLOYEE" && onboardingStatus === "Approved";

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const breadcrumbs =
    isHR || isEmployeeApproved
      ? isHR
        ? [
            { label: "Employee Profiles", path: "/hr" },
            { label: "Visa Status", path: "/hr/visa" },
            { label: "Hiring Management", path: "/hr/hiring" },
          ]
        : [
            { label: "Personal Info", path: "/employee/personal" },
            { label: "Visa Status", path: "/visa" },
          ]
      : [];

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1100,
        height: 64,
        bgcolor: "neutral.softBg",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: 3,
        boxShadow: "sm",
      }}
    >
      <Breadcrumbs separator={<KeyboardArrowLeft />} aria-label="breadcrumbs">
        <Typography level="title-md" color="primary">
          {user.username}
        </Typography>

        {breadcrumbs.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            style={{ textDecoration: "none" }}
          >
            <Typography level="body-sm" color="neutral">
              {item.label}
            </Typography>
          </NavLink>
        ))}
      </Breadcrumbs>
      <Button color="danger" variant="solid" onClick={handleLogout}>
        Logout
      </Button>
    </Box>
  );
};

export default Header;
