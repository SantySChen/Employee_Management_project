import React, { useRef } from "react";
import {
  TabPanel,
  Typography,
  Button,
  Stack,
  FormControl,
  FormLabel,
} from "@mui/joy";

interface Props {
  profilePicUrl: string;
  setProfilePicUrl: (url: string) => void;
  driverLicenseUrl: string;
  setDriverLicenseUrl: (url: string) => void;
  workAuthUrl: string;
  setWorkAuthUrl: (url: string) => void;
  readonly?: boolean;
}

const Panel8: React.FC<Props> = ({
  profilePicUrl,
  setProfilePicUrl,
  driverLicenseUrl,
  setDriverLicenseUrl,
  workAuthUrl,
  setWorkAuthUrl,
  readonly = false,
}) => {
  const profilePicRef = useRef<HTMLInputElement>(null);
  const driverRef = useRef<HTMLInputElement>(null);
  const workAuthRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "profilePic" | "driverLicense" | "workAuth"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewURL = URL.createObjectURL(file);
      switch (type) {
        case "profilePic":
          setProfilePicUrl(previewURL);
          break;
        case "driverLicense":
          setDriverLicenseUrl(previewURL);
          break;
        case "workAuth":
          setWorkAuthUrl(previewURL);
          break;
        default:
          break;
      }
    }
  };

  const renderUploadField = (
    label: string,
    url: string,
    ref: React.RefObject<HTMLInputElement | null>,
    type: "profilePic" | "driverLicense" | "workAuth",
    accept: string,
    showImage: boolean = false
  ) => (
    <FormControl>
      <FormLabel>{label}</FormLabel>
      <Stack direction="row" spacing={2} alignItems="center">
        {url ? (
          <>
            <Button
              component="a"
              href={url}
              target="_blank"
              download
              variant="soft"
            >
              Download
            </Button>
            <Button
            component="a"
            href={url}
            target="_blank"
            variant="plain"
          >
            Preview
          </Button>
            {!readonly && (
              <>
                <Button onClick={() => ref.current?.click()}>Change</Button>
                <input
                  type="file"
                  accept=".pdf,image/*"
                  hidden
                  ref={ref}
                  onChange={(e) => handleFileChange(e, type)}
                />
              </>
            )}
          </>
        ) : !readonly ? (
          <>
            <Button onClick={() => ref.current?.click()}>Upload</Button>
            <input
              type="file"
              accept={accept}
              hidden
              ref={ref}
              onChange={(e) => handleFileChange(e, type)}
            />
          </>
        ) : (
          <Typography level="body-sm" color="neutral">
            Not uploaded
          </Typography>
        )}
      </Stack>
      {showImage && url && (
        <img
          src={url}
          alt={label}
          style={{ marginTop: 8, maxWidth: 200, borderRadius: 8 }}
        />
      )}
    </FormControl>
  );

  return (
    <TabPanel value={8}>
      <Stack spacing={4}>
        {renderUploadField(
          "Profile Picture",
          profilePicUrl,
          profilePicRef,
          "profilePic",
          "image/*",
          true
        )}
        {renderUploadField(
          "Driver's License",
          driverLicenseUrl,
          driverRef,
          "driverLicense",
          "application/pdf"
        )}
        {renderUploadField(
          "Work Authorization",
          workAuthUrl,
          workAuthRef,
          "workAuth",
          "application/pdf"
        )}
      </Stack>
    </TabPanel>
  );
};

export default Panel8;
