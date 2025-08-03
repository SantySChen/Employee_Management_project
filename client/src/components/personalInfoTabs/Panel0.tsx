import React from "react";
import { FormControl, FormLabel, Input } from "@mui/joy";

interface Props {
  firstname: string;
  setFirstname: (value: string) => void;
  middlename: string;
  setMiddlename: (value: string) => void;
  lastname: string;
  setLastname: (value: string) => void;
  preferredname: string;
  setPreferredname: (value: string) => void;
  readonly: boolean;
}

const Panel0: React.FC<Props> = ({
  firstname,
  setFirstname,
  middlename,
  setMiddlename,
  lastname,
  setLastname,
  preferredname,
  setPreferredname,
  readonly,
}) => {
  return (
    <>
      <FormControl required>
        <FormLabel>First Name</FormLabel>
        <Input
          name="firstname"
          type="text"
          value={firstname}
          onChange={(e) => setFirstname(e.target.value)}
          disabled={readonly}
        />
      </FormControl>

      <FormControl>
        <FormLabel>Middle Name</FormLabel>
        <Input
          name="middlename"
          type="text"
          value={middlename}
          onChange={(e) => setMiddlename(e.target.value)}
          disabled={readonly}
        />
      </FormControl>

      <FormControl required>
        <FormLabel>Last Name</FormLabel>
        <Input
          name="lastname"
          type="text"
          value={lastname}
          onChange={(e) => setLastname(e.target.value)}
          disabled={readonly}
        />
      </FormControl>

      <FormControl>
        <FormLabel>Preferred Name</FormLabel>
        <Input
          name="preferredname"
          type="text"
          value={preferredname}
          onChange={(e) => setPreferredname(e.target.value)}
          disabled={readonly}
        />
      </FormControl>
    </>
  );
};

export default Panel0;