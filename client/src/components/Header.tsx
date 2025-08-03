import { NavLink, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { logout } from "../features/auth/authSlice";
import { Box, Breadcrumbs, Button, Typography } from "@mui/joy";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import { AppBar } from "@mui/material";

const Header: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  if (!user) return null;

  const isHR = user.role === "HR";

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const breadcrumbs = isHR
    ? [
        { label: "Home", path: "/dashboard" },
        { label: "Invite", path: "/invite"},
        { label: "Employee Profiles", path: "/employees" },
        { label: "Visa Status", path: "/visa-status" },
        { label: "Hiring Management", path: "/hiring" },
      ]
    : [
        { label: "Personal Info", path: "/profile" },
        { label: "Visa Status", path: "/visa-status" },
      ];

  return (
    <AppBar position="static" sx={{ mb: 3, px: 2, py: 1.5 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
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
    </AppBar>
  );
};

export default Header;
