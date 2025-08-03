import React from "react";
import { TabPanel, FormControl, FormLabel, Input } from "@mui/joy";

interface Props {
  cellPhone: string;
  workPhone: string;
  setCellPhone: (value: string) => void;
  setWorkPhone: (value: string) => void;
}

const Panel3: React.FC<Props> = ({
  cellPhone,
  workPhone,
  setCellPhone,
  setWorkPhone,
}) => {
  return (
    <TabPanel value={3}>
      <FormControl required>
        <FormLabel>Cell Phone</FormLabel>
        <Input
          name="cellPhone"
          type="text"
          value={cellPhone}
          onChange={(e) => setCellPhone(e.target.value)}
        />
      </FormControl>
      <FormControl>
        <FormLabel>Work Phone</FormLabel>
        <Input
          name="workPhone"
          type="text"
          value={workPhone}
          onChange={(e) => setWorkPhone(e.target.value)}
          required
        />
      </FormControl>
    </TabPanel>
  );
};

export default Panel3;
