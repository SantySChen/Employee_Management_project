import { Box } from "@mui/joy";
import { useAppSelector } from "../../app/hooks";
import PersonalInfoTabs from "../../components/personalInfoTabs/PersonalInfoTabs";
import StatusCard from "../../components/StatusCard";

const OnboardingPage: React.FC = () => {
  const onboarding = useAppSelector((state) => state.onboarding.data);
  
  return (
    <Box
      display="flex"
      flexDirection={{ xs: "column", md: "column" }}
      alignItems={{ xs: "stretch", md: "center" }}
      gap={3}
      width="100%"
      p={3}
    >
      <Box
        flex={{ xs: "none", md: 1 }}
        minWidth={300}
        display="flex"
        justifyContent="center"
      >
        <StatusCard onboarding={onboarding} />
      </Box>

      <Box flex={{ xs: "none", md: 2 }} width="100%">
        <PersonalInfoTabs />
      </Box>
    </Box>
  );
};

export default OnboardingPage;
