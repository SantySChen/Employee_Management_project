import React, { useState } from "react";
import { Box, Button, Stack } from "@mui/joy";
import PersonalInfoTabs from "../../components/personalInfoTabs/PersonalInfoTabs";

const PersonalInformationPage: React.FC = () => {
  const [isEditable, setIsEditable] = useState(false);

  const handleEdit = () => {
    setIsEditable(true);
  };

  const handleCancel = () => {
    setIsEditable(false);
  };

  const handleSave = () => {
    setIsEditable(false);
  };

  return (
    <Box sx={{ p: 4 }}>
      <PersonalInfoTabs readonly={!isEditable} />

      <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
        {!isEditable ? (
          <Button variant="outlined" onClick={handleEdit}>
            Edit
          </Button>
        ) : (
          <>
            <Button variant="soft" color="neutral" onClick={handleCancel}>
              Cancel
            </Button>
            <Button variant="solid" color="primary" onClick={handleSave}>
              Save
            </Button>
          </>
        )}
      </Stack>
    </Box>
  );
};

export default PersonalInformationPage;
