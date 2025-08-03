import {
  Button,
  CssBaseline,
  FormControl,
  FormLabel,
  Input,
  Sheet,
  Typography,
} from "@mui/joy";
import MailIcon from "@mui/icons-material/Mail";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { inviteEmployee } from "./hrSlice";

const InvitePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { loading, error, success } = useAppSelector((state) => state.hr);

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const validateEmailFormat = (value: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError("");

    if (!validateEmailFormat(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    dispatch(inviteEmployee(email));
  };

  return (
    <main>
      <CssBaseline />
      <Sheet
        sx={{
          width: 400,
          mx: "auto",
          my: 4,
          py: 3,
          px: 3,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          borderRadius: "sm",
          boxShadow: "md",
        }}
        variant="outlined"
      >
        <Typography level="h4" component="h1" textAlign="center">
          <b>Invite New Employee</b>
        </Typography>

        <form onSubmit={handleSubmit}>
          <FormControl>
            <FormLabel>Email Address</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              startDecorator={<MailIcon />}
              endDecorator={
                <Button type="submit" loading={loading}>
                  Invite
                </Button>
              }
              placeholder="example@email.com"
            />
          </FormControl>

          {(emailError || error) && (
            <Typography level="body-sm" color="danger" mt={1}>
              {emailError || error}
            </Typography>
          )}

          {success && (
            <Typography level="body-sm" color="success" mt={1}>
              Invitation sent successfully!
            </Typography>
          )}
        </form>
      </Sheet>
    </main>
  );
};

export default InvitePage;