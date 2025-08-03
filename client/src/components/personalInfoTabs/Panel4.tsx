import React from "react";
import { TabPanel, FormControl, FormLabel, Input } from "@mui/joy";

interface Props {
  email: string;
}

const Panel4: React.FC<Props> = ({ email }) => {
  return (
    <TabPanel value={4}>
      <FormControl required>
        <FormLabel>Email</FormLabel>
        <Input
          name="email"
          type="email"
          value={email}
          readOnly
        />
      </FormControl>
    </TabPanel>
  );
};

export default Panel4;
