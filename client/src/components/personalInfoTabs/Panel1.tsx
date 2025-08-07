import React, { useRef } from "react";
import { TabPanel, Box, Button, Typography } from "@mui/joy";

interface Props {
  imagePreview: string | null;
  setImagePreview: (url: string | null) => void;
  setProfilePicUrl: (url: string) => void;
  setProfilePicFile: (file: File) => void;
  readonly: boolean;
}

const Panel1: React.FC<Props> = ({
  imagePreview,
  setImagePreview,
  setProfilePicUrl,
  setProfilePicFile,
  readonly,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    setProfilePicUrl(previewUrl);
    setProfilePicFile(file);
  };

  return (
    <TabPanel value={1}>
      <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
        {imagePreview ? (
          <img
            src={imagePreview}
            alt="Profile Preview"
            style={{
              width: 160,
              height: 160,
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
        ) : (
          <Box
            width={120}
            height={120}
            display="flex"
            alignItems="center"
            justifyContent="center"
            border="1px dashed gray"
            borderRadius="50%"
          >
            <Typography level="body-sm">No Image</Typography>
          </Box>
        )}

        <input
          type="file"
          accept="image/*"
          hidden
          ref={fileInputRef}
          onChange={handleFileChange}
        />

        {!readonly && (
          <Button onClick={() => fileInputRef.current?.click()}>
            {imagePreview ? "Change Image" : "Upload Image"}
          </Button>
        )}
      </Box>
    </TabPanel>
  );
};

export default Panel1;
