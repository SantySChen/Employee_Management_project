import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { verifyToken } from "./authSlice";
import RegisterPage from "./RegisterPage";
import { Typography } from "@mui/joy";

const RegisterWithTokenPage = () => {
  const { token } = useParams(); 
  const dispatch = useAppDispatch();
  const { tokenValid, loading, error } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      dispatch(verifyToken(token));
    }
  }, [dispatch, token]);

  if (loading) return <p>Verifying link...</p>;
  if (error) return <Typography color="danger">{error}</Typography>;
  if (tokenValid === false) return <p>Invalid or expired link.</p>;

  return <RegisterPage />;
};

export default RegisterWithTokenPage;