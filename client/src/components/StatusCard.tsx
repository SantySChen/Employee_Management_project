import React from "react";
import { Card, CardContent, Typography } from "@mui/joy";
import type { Onboarding } from "../features/onboarding/types";

interface Props {
  onboarding: Onboarding | null;
}

const OnboardingStatusCard: React.FC<Props> = ({ onboarding }) => {
  if (!onboarding) {
    return (
      <Card color="warning" variant="soft" size="lg">
        <CardContent>
          <Typography color="warning">
            Please submit your onboarding application.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  if (onboarding.status === "Rejected") {
    return (
      <Card color="danger" variant="outlined" size="lg">
        <CardContent>
          <Typography color="danger">
            Application Rejected
          </Typography>
          <Typography level="body-md" mt={1}>
            Feedback: {onboarding.feedback || "No feedback provided."}
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card color="primary" variant="soft" size="lg">
      <CardContent>
        <Typography color="primary">
          Please wait for HR to review your application.
        </Typography>
      </CardContent>
    </Card>
  );
};

export default OnboardingStatusCard;
