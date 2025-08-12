import React from "react";
import {
  TabPanel,
  FormControl,
  FormLabel,
  Input,
  RadioGroup,
  Radio,
  Stack,
} from "@mui/joy";

interface Props {
  ssn: string;
  dob: string;
  gender: "male" | "female" | "prefer_not_to_say";
  setSsn: (value: string) => void;
  setDob: (value: string) => void;
  setGender: (value: "male" | "female" | "prefer_not_to_say") => void;
  readonly: boolean;
}

const Panel5: React.FC<Props> = ({
  ssn,
  dob,
  gender,
  setSsn,
  setDob,
  setGender,
  readonly,
}) => {
  return (
    <TabPanel value={5}>
      <FormControl>
        <Stack spacing={2}>
          <FormControl required>
            <FormLabel>SSN</FormLabel>
            <Input
              name="ssn"
              type="text"
              value={ssn}
              onChange={(e) => {
                const numericValue = e.target.value.replace(/\D/g, "");
                setSsn(numericValue);
              }}
              placeholder="Enter your SSN"
              disabled={readonly}
              required
            />
          </FormControl>
          <FormControl required>
            <FormLabel>Date of Birth</FormLabel>
            <Input
              name="dob"
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              disabled={readonly}
              required
            />
          </FormControl>
          <FormControl required>
            <FormLabel>Gender</FormLabel>
            <RadioGroup
              name="gender"
              value={gender}
              onChange={(e) =>
                setGender(
                  e.target.value as "male" | "female" | "prefer_not_to_say"
                )
              }
            >
              <Radio value="male" label="Male" disabled={readonly} />
              <Radio value="female" label="Female" disabled={readonly} />
              <Radio
                value="prefer_not_to_say"
                label="I do not wish to answer"
                disabled={readonly}
              />
            </RadioGroup>
          </FormControl>
        </Stack>
      </FormControl>
    </TabPanel>
  );
};

export default Panel5;
