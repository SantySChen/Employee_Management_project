import React from "react";
import {
  TabPanel,
  Typography,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  IconButton,
} from "@mui/joy";
import { Delete } from "@mui/icons-material";

export interface Reference {
  firstName: string;
  lastName: string;
  middleName: string;
  phone: string;
  email: string;
  relationship: string;
}

interface Props {
  reference: Reference;
  setReference: React.Dispatch<React.SetStateAction<Reference>>;
  showReference: boolean;
  setShowReference: React.Dispatch<React.SetStateAction<boolean>>;
  emergencyContacts: Reference[];
  handleEmergencyChange: (
    index: number,
    field: keyof Reference,
    value: string
  ) => void;
  addEmergencyContact: () => void;
  removeEmergencyContact: (index: number) => void;
  readonly: boolean;
}

const Panel7: React.FC<Props> = ({
  reference,
  setReference,
  showReference,
  setShowReference,
  emergencyContacts,
  handleEmergencyChange,
  addEmergencyContact,
  removeEmergencyContact,
  readonly,
}) => {
  const referenceFields: (keyof Reference)[] = [
    "firstName",
    "lastName",
    "middleName",
    "phone",
    "email",
    "relationship",
  ];

  return (
    <TabPanel value={7}>
      <Stack spacing={3}>
        {(!readonly ||
          showReference ||
          Object.values(reference).some((val) => val)) && (
          <>
            <Typography>Reference (Optional)</Typography>

            {!showReference && !readonly ? (
              <Button onClick={() => setShowReference(true)}>
                Add Reference
              </Button>
            ) : (
              <>
                {!readonly && (
                  <Button
                    variant="soft"
                    color="danger"
                    onClick={() => {
                      setShowReference(false);
                      setReference({
                        firstName: "",
                        lastName: "",
                        middleName: "",
                        phone: "",
                        email: "",
                        relationship: "",
                      });
                    }}
                    disabled={readonly}
                  >
                    Remove Reference
                  </Button>
                )}
                <Stack spacing={2}>
                  {referenceFields.map((field) => (
                    <FormControl key={field}>
                      <FormLabel>
                        {field.replace(/^\w/, (c) => c.toUpperCase())}
                      </FormLabel>
                      <Input
                        type={field === "email" ? "email" : "text"}
                        value={reference[field]}
                        onChange={(e) =>
                          setReference({
                            ...reference,
                            [field]: e.target.value,
                          })
                        }
                        disabled={readonly}
                      />
                    </FormControl>
                  ))}
                </Stack>
              </>
            )}
          </>
        )}

        <Typography>
          Emergency Contact(s) <span style={{ color: "red" }}>*</span>
        </Typography>

        {emergencyContacts.map((contact, idx) => (
          <Stack
            spacing={2}
            key={idx}
            sx={{ borderBottom: "1px solid #ccc", pb: 2 }}
          >
            {referenceFields.map((field) => (
              <FormControl
                key={field}
                required={["firstName", "lastName", "relationship"].includes(
                  field
                )}
              >
                <FormLabel>
                  {field.replace(/^\w/, (c) => c.toUpperCase())}
                </FormLabel>
                <Input
                  type={field === "email" ? "email" : "text"}
                  value={contact[field]}
                  onChange={(e) =>
                    handleEmergencyChange(idx, field, e.target.value)
                  }
                  disabled={readonly}
                />
              </FormControl>
            ))}
            {emergencyContacts.length > 1 && !readonly && (
              <IconButton
                variant="soft"
                color="danger"
                onClick={() => removeEmergencyContact(idx)}
                disabled={readonly}
              >
                <Delete />
              </IconButton>
            )}
          </Stack>
        ))}

        {!readonly && (
          <Button onClick={addEmergencyContact}>
            Add Another Emergency Contact
          </Button>
        )}
      </Stack>
    </TabPanel>
  );
};

export default Panel7;
