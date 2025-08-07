import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { login } from "./authSlice";
import {
  Sheet,
  Typography,
  Input,
  Button,
  CssBaseline,
  FormControl,
  FormLabel,
} from "@mui/joy";
import { useNavigate } from "react-router-dom";
import { fetchOnboarding } from "../onboarding/onboardingSlice";

const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { loading, error } = useAppSelector((state) => state.auth);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const response = await dispatch(login({ username, password })).unwrap();
    const user = response.user;

    if (user.role === "EMPLOYEE") {
      try {
        const onboarding = await dispatch(fetchOnboarding(user._id!)).unwrap();

        if (onboarding.status === "Approved") {
          navigate("/employee/personal");
        } else {
          navigate("/onboard");
        }
      } catch (err) {
        console.warn("Onboarding not found. Redirecting to onboarding page.", err);
        navigate("/onboard");
      }
    } else if (user.role === "HR") {
      navigate("/hr");
    }
  } catch (err) {
    console.error("Login failed:", err);
  }
};

  return (
    <main>
      <CssBaseline />
      <Sheet
        sx={{
          width: 300,
          mx: "auto",
          my: 4,
          py: 3,
          px: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          borderRadius: "sm",
          boxShadow: "md",
        }}
        variant="outlined"
      >
        <form onSubmit={handleSubmit}>
          <div>
            <Typography level="h4" component="h1">
              <b>Welcome!</b>
            </Typography>
            <Typography level="body-sm">Sign in to continue.</Typography>
          </div>

          <FormControl>
            <FormLabel>Username</FormLabel>
            <Input
              name="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </FormControl>

          <FormControl>
            <FormLabel>Password</FormLabel>
            <Input
              name="password"
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </FormControl>

          {error && (
            <Typography level="body-sm" color="danger">
              {error}
            </Typography>
          )}

          <Button type="submit" sx={{ mt: 1 }} disabled={loading}>
            {loading ? "Logging in..." : "Log in"}
          </Button>
        </form>
      </Sheet>
    </main>
  );
};

export default LoginPage;
