import React from "react";
import { TabPanel, FormControl, FormLabel, Input } from "@mui/joy";

interface Props {
  building: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  setBuilding: (val: string) => void;
  setStreet: (val: string) => void;
  setCity: (val: string) => void;
  setState: (val: string) => void;
  setZip: (val: string) => void;
  readonly: boolean;
}

const Panel2: React.FC<Props> = ({
  building,
  street,
  city,
  state,
  zip,
  setBuilding,
  setStreet,
  setCity,
  setState,
  setZip,
  readonly
}) => {
  return (
    <TabPanel value={2}>
      <FormControl required>
        <FormLabel>Building/Apt#</FormLabel>
        <Input
          name="building"
          type="text"
          value={building}
          onChange={(e) => setBuilding(e.target.value)}
          disabled={readonly}
        />
      </FormControl>
      <FormControl required>
        <FormLabel>Street</FormLabel>
        <Input
          name="street"
          type="text"
          value={street}
          onChange={(e) => setStreet(e.target.value)}
          disabled={readonly}
        />
      </FormControl>
      <FormControl required>
        <FormLabel>City</FormLabel>
        <Input
          name="city"
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          disabled={readonly}
        />
      </FormControl>
      <FormControl required>
        <FormLabel>State</FormLabel>
        <Input
          name="state"
          type="text"
          value={state}
          onChange={(e) => setState(e.target.value)}
          disabled={readonly}
        />
      </FormControl>
      <FormControl required>
        <FormLabel>Zip Code</FormLabel>
        <Input
          name="zip"
          type="text"
          value={zip}
          onChange={(e) => setZip(e.target.value)}
          disabled={readonly}
        />
      </FormControl>
    </TabPanel>
  );
};

export default Panel2;
