import React, { useEffect } from "react";
import { Box, Typography, Stack, Divider, Button, Link } from "@mui/joy";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchVisa, uploadVisa } from "./visaSlice";
import type { VisaStepKey } from "./types";
import i983Empty from "./i983-empty.pdf";
import i983Sample from "./i983-sample.pdf";

const VisaPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const onboarding = useAppSelector((state) => state.onboarding.data);
  const visa = useAppSelector((state) => state.visa.data);
  const loading = useAppSelector((state) => state.visa.loading);

  const [uploadingStep, setUploadingStep] = React.useState<VisaStepKey | null>(
    null
  );

  const userId =
    typeof onboarding?.userId === "string"
      ? onboarding.userId
      : onboarding?._id;

  useEffect(() => {
    if (userId) {
      dispatch(fetchVisa(userId));
    }
  }, [userId, dispatch]);

  const usResidentStatus = onboarding?.usResidentStatus;
  const isF1Visa = usResidentStatus?.visaType === "F1(CPT/OPT)";

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    step: VisaStepKey
  ) => {
    const file = e.target.files?.[0];
    if (!file || !userId) return;

    dispatch(uploadVisa({ userId, step, file }));
    setUploadingStep(null);
  };

  const getCurrentStepToShow = (): VisaStepKey => {
    if (!visa?.optReceipt || visa.optReceipt.status !== "Approved")
      return "optReceipt";
    if (!visa?.optEAD || visa.optEAD.status !== "Approved") return "optEAD";
    if (!visa?.i983 || visa.i983.status !== "Approved") return "i983";
    return "i20";
  };

  const getVisaLabel = () => {
    if (usResidentStatus?.isCitizenOrResident && usResidentStatus.title) {
      return usResidentStatus.title;
    }
    if (usResidentStatus?.visaType && usResidentStatus.visaType !== "Other") {
      return usResidentStatus.visaType;
    }
    if (usResidentStatus?.visaType === "Other") {
      return usResidentStatus.otherTitle || "Other";
    }
    return "Not Specified";
  };

  const renderUploadButton = (step: VisaStepKey, disabled: boolean = false) => (
    <>
      <Button
        size="sm"
        variant="outlined"
        onClick={() => setUploadingStep(step)}
        disabled={disabled}
      >
        Upload File
      </Button>
      {uploadingStep === step && (
        <input
          type="file"
          accept=".pdf,.jpg,.png"
          onChange={(e) => handleFileChange(e, step)}
          style={{ marginTop: 8 }}
        />
      )}
    </>
  );

  const formatStepLabel = (step: VisaStepKey) => {
    switch (step) {
      case "optReceipt":
        return "OPT Receipt";
      case "optEAD":
        return "Please upload a copy of your OPT EAD.";
      case "i983":
        return "Please download and fill out the I-983 form.";
      case "i20":
        return "Please send the I-983 along with all necessary documents to your school and upload the new I-20.";
      default:
        return step;
    }
  };

  const renderMessage = (step: VisaStepKey): React.ReactNode => {
    const status = visa?.[step]?.status;
    const feedback = visa?.[step]?.feedback;

    const canUpload = (step: VisaStepKey): boolean => {
      if (step === "optReceipt") return true;
      if (step === "optEAD") return visa?.optReceipt?.status === "Approved";
      if (step === "i983") return visa?.optEAD?.status === "Approved";
      if (step === "i20") return visa?.i983?.status === "Approved";
      return false;
    };

    if (step === "i983") {
      if (!visa?.optEAD || visa.optEAD.status !== "Approved") {
        return <Typography>Please wait until OPT EAD is approved.</Typography>;
      }

      return (
        <Stack spacing={1}>
          <Typography>Download and complete the I-983 form:</Typography>
          <Link href={i983Empty} target="_blank" download>
            Download Empty Template
          </Link>
          <Link href={i983Sample} target="_blank" download>
            Download Sample Template
          </Link>

          {status === "Pending" && (
            <Typography>
              Waiting for HR to approve and sign your I-983.
            </Typography>
          )}

          {status === "Rejected" && (
            <>
              <Typography color="danger">HR Feedback: {feedback}</Typography>
              {renderUploadButton("i983")}
            </>
          )}

          {(!status || status === "Rejected") && renderUploadButton("i983")}

          {status === "Approved" && <></>}
        </Stack>
      );
    }

    if (status === "Pending") {
      return (
        <Typography>
          Waiting for HR to approve your {formatStepLabel(step)}.
        </Typography>
      );
    }

    if (status === "Rejected") {
      return (
        <>
          <Typography color="danger">HR Feedback: {feedback}</Typography>
          {canUpload(step) && renderUploadButton(step)}
        </>
      );
    }

    if (status === "Approved") {
      switch (step) {
        case "optReceipt":
          return <>{renderUploadButton("optEAD")}</>;
        case "optEAD":
          return <></>;
        case "i20":
          return <Typography>All documents have been approved.</Typography>;
      }
    }

    if (!status && canUpload(step)) {
      return (
        <>
          <Typography>{formatStepLabel(step)}</Typography>
          {renderUploadButton(step)}
        </>
      );
    }

    if (!status && !canUpload(step)) {
      return (
        <Typography>
          Please wait until the previous step is approved.
        </Typography>
      );
    }

    return null;
  };

  return (
    <Box p={3}>
      <Typography level="h4" mb={2}>
        Visa Information
      </Typography>

      <Stack spacing={2}>
        <Box>
          <Typography level="title-sm">Visa Type</Typography>
          <Typography>{getVisaLabel()}</Typography>
        </Box>

        {isF1Visa && (
          <>
            <Divider />
            {loading ? (
              <Typography>Loading visa data...</Typography>
            ) : (
              <Stack spacing={3}>
                {getCurrentStepToShow() === "optReceipt" && (
                  <Box>
                    <Typography level="title-sm">OPT Receipt</Typography>
                    {renderMessage("optReceipt")}
                  </Box>
                )}

                {getCurrentStepToShow() === "optEAD" && (
                  <Box>
                    <Typography level="title-sm">OPT EAD</Typography>
                    {renderMessage("optEAD")}
                  </Box>
                )}

                {getCurrentStepToShow() === "i983" && (
                  <Box>
                    <Typography level="title-sm">I-983</Typography>
                    {renderMessage("i983")}
                  </Box>
                )}

                {getCurrentStepToShow() === "i20" && (
                  <Box>
                    <Typography level="title-sm">I-20</Typography>
                    {renderMessage("i20")}
                  </Box>
                )}
              </Stack>
            )}
          </>
        )}
      </Stack>
    </Box>
  );
};

export default VisaPage;
