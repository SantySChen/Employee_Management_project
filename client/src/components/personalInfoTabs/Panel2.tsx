import React from "react";
import {
  TabPanel,
  FormControl,
  FormLabel,
  Input,
  Select,
  Option,
} from "@mui/joy";

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
  readonly,
}) => {
  return (
    <TabPanel value={2}>
      <FormControl required>
        <FormLabel>Building/Apt#</FormLabel>
        <Input
          name="building"
          type="text"
          value={building}
          onChange={(e) => {
            const numericValue = e.target.value.replace(/\D/g, "");
            setBuilding(numericValue);
          }}
          disabled={readonly}
          required
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
          required
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
          required
        />
      </FormControl>
      <FormControl required sx={{ minWidth: 200 }}>
        <FormLabel>State</FormLabel>
        <Select
          name="state"
          value={state}
          onChange={(e, newValue) => {
            if (newValue) setState(newValue);
          }}
          disabled={readonly}
          placeholder="Select a state"
          sx={{ width: "100%" }}
          required
        >
          {[
            "AL",
            "AK",
            "AZ",
            "AR",
            "CA",
            "CO",
            "CT",
            "DE",
            "FL",
            "GA",
            "HI",
            "ID",
            "IL",
            "IN",
            "IA",
            "KS",
            "KY",
            "LA",
            "ME",
            "MD",
            "MA",
            "MI",
            "MN",
            "MS",
            "MO",
            "MT",
            "NE",
            "NV",
            "NH",
            "NJ",
            "NM",
            "NY",
            "NC",
            "ND",
            "OH",
            "OK",
            "OR",
            "PA",
            "RI",
            "SC",
            "SD",
            "TN",
            "TX",
            "UT",
            "VT",
            "VA",
            "WA",
            "WV",
            "WI",
            "WY",
          ].map((abbr) => (
            <Option key={abbr} value={abbr}>
              {abbr}
            </Option>
          ))}
        </Select>
      </FormControl>
      <FormControl required>
        <FormLabel>Zip Code</FormLabel>
        <Input
          name="zip"
          type="text"
          value={zip}
          onChange={(e) => setZip(e.target.value)}
          disabled={readonly}
          required
        />
      </FormControl>
    </TabPanel>
  );
};

export default Panel2;
