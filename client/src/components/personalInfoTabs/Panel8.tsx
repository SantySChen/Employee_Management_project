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
  setProfilePicFile: (file: File) => void;
  driverLicenseUrl: string;
  setDriverLicenseUrl: (url: string) => void;
  setDriverLicenseFile: (file: File) => void;
  workAuthUrl: string;
  setWorkAuthUrl: (url: string) => void;
  setWorkAuthFile: (file: File) => void;
  readonly?: boolean;
}

const Panel8: React.FC<Props> = ({
  profilePicUrl,
  setProfilePicUrl,
  setProfilePicFile,
  driverLicenseUrl,
  setDriverLicenseUrl,
  setDriverLicenseFile,
  workAuthUrl,
  setWorkAuthUrl,
  setWorkAuthFile,
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
          setProfilePicFile(file);
          break;
        case "driverLicense":
          setDriverLicenseUrl(previewURL);
          setDriverLicenseFile(file);
          break;
        case "workAuth":
          setWorkAuthUrl(previewURL);
          setWorkAuthFile(file);
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
              variant="soft"
              onClick={async () => {
                try {
                  const response = await fetch(url);
                  const blob = await response.blob();
                  const blobUrl = window.URL.createObjectURL(blob);

                  const a = document.createElement("a");
                  a.href = blobUrl;
                  a.download = url.split("/").pop() || "download";
                  document.body.appendChild(a);
                  a.click();
                  a.remove();

                  window.URL.revokeObjectURL(blobUrl);
                } catch (error) {
                  console.error("Download failed", error);
                }
              }}
            >
              Download
            </Button>
            <Button
              component="a"
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              variant="plain"
            >
              {url.includes("blob:") && !url.endsWith(".pdf")
                ? "View Image"
                : "Preview"}
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
      {showImage && url && url.startsWith("blob:") && (
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
