import React, { type RefObject } from "react";
import {
  TabPanel,
  Stack,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  Input,
  Button,
  Typography,
} from "@mui/joy";

interface Props {
  isCitizenOrResident: "yes" | "no" | "";
  residentTitle: "Green Card" | "Citizen" | "";
  visaType: "H1-B" | "L2" | "F1(CPT/OPT)" | "H4" | "Other" | "";
  otherTitle: string;
  optReceipt: File | null;
  startDate: string;
  endDate: string;
  setIsCitizenOrResident: (val: "yes" | "no") => void;
  setResidentTitle: (val: "Green Card" | "Citizen") => void;
  setVisaType: (val: "H1-B" | "L2" | "F1(CPT/OPT)" | "H4" | "Other") => void;
  setOtherTitle: (val: string) => void;
  setOptReceipt: (file: File) => void;
  setStartDate: (val: string) => void;
  setEndDate: (val: string) => void;
  fileInputRef: RefObject<HTMLInputElement | null>;
  handleUploadClick: () => void;
  readonly: boolean;
}

const Panel6: React.FC<Props> = ({
  isCitizenOrResident,
  residentTitle,
  visaType,
  otherTitle,
  optReceipt,
  startDate,
  endDate,
  setIsCitizenOrResident,
  setResidentTitle,
  setVisaType,
  setOtherTitle,
  setOptReceipt,
  setStartDate,
  setEndDate,
  fileInputRef,
  handleUploadClick,
  readonly,
}) => {
  return (
    <TabPanel value={6}>
      <Stack spacing={2}>
        <FormControl required>
          <FormLabel>
            Are you a citizen or permanent resident of the U.S.?
          </FormLabel>
          <RadioGroup
            name="us-resident"
            value={isCitizenOrResident}
            onChange={(e) =>
              setIsCitizenOrResident(e.target.value as "yes" | "no")
            }
          >
            <Radio value="yes" label="Yes" disabled={readonly} />
            <Radio value="no" label="No" disabled={readonly} />
          </RadioGroup>
        </FormControl>

        {isCitizenOrResident === "yes" && (
          <FormControl required>
            <FormLabel>Select one</FormLabel>
            <RadioGroup
              name="resident-title"
              value={residentTitle}
              onChange={(e) =>
                setResidentTitle(e.target.value as "Green Card" | "Citizen")
              }
            >
              <Radio
                value="Green Card"
                label="Green Card"
                disabled={readonly}
              />
              <Radio value="Citizen" label="Citizen" disabled={readonly} />
            </RadioGroup>
          </FormControl>
        )}

        {isCitizenOrResident === "no" && (
          <>
            <FormControl required>
              <FormLabel>What is your work authorization?</FormLabel>
              <RadioGroup
                name="visa-type"
                value={visaType}
                onChange={(e) =>
                  setVisaType(
                    e.target.value as
                      | "H1-B"
                      | "L2"
                      | "F1(CPT/OPT)"
                      | "H4"
                      | "Other"
                  )
                }
              >
                <Radio value="H1-B" label="H1-B" disabled={readonly} />
                <Radio value="L2" label="L2" disabled={readonly} />
                <Radio
                  value="F1(CPT/OPT)"
                  label="F1 (CPT/OPT)"
                  disabled={readonly}
                />
                <Radio value="H4" label="H4" disabled={readonly} />
                <Radio value="Other" label="Other" disabled={readonly} />
              </RadioGroup>
            </FormControl>

            {visaType === "F1(CPT/OPT)" && (
              <>
                <input
                  type="file"
                  accept=".pdf"
                  ref={fileInputRef}
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      setOptReceipt(e.target.files[0]);
                    }
                  }}
                  style={{ display: "none" }}
                />
                {!readonly && (
                  <Button onClick={handleUploadClick}>
                    {optReceipt ? "Change OPT Receipt" : "Upload OPT Receipt"}
                  </Button>
                )}

                {optReceipt && (
                  <Typography level="body-sm">
                    Selected: {optReceipt.name}
                  </Typography>
                )}
              </>
            )}

            {visaType === "Other" && (
              <FormControl required>
                <FormLabel>Please specify your visa type</FormLabel>
                <Input
                  name="otherVisaTitle"
                  value={otherTitle}
                  onChange={(e) => setOtherTitle(e.target.value)}
                  disabled={readonly}
                />
              </FormControl>
            )}

            <FormControl required>
              <FormLabel>Start Date</FormLabel>
              <Input
                type="date"
                name="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                disabled={readonly}
              />
            </FormControl>

            <FormControl required>
              <FormLabel>End Date</FormLabel>
              <Input
                type="date"
                name="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                disabled={readonly}
              />
            </FormControl>
          </>
        )}
      </Stack>
    </TabPanel>
  );
};

export default Panel6;
