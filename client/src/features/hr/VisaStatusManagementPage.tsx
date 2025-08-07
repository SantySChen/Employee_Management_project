import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Stack,
  Modal,
  ModalDialog,
  Textarea,
} from "@mui/joy";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchAllApprovedOnboardings, fetchAllVisasThunk } from "./hrSlice";
import type { VisaStepKey } from "../../features/visa/types";
import { reviewVisa } from "../visa/visaSlice";

const getUserId = (id: string | { _id: string }): string => {
  if (typeof id === "string") return id;
  if (id && typeof id === "object" && "_id" in id) return id._id;
  return "";
};

const handleDownload = async (url: string, filename: string) => {
  try {
    const response = await fetch(url, { mode: "cors" });
    const blob = await response.blob();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (err) {
    console.error("Download failed", err);
  }
};

const VisaManagementPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { visas, loading, totalVisaPages, approvedOnboardings } =
    useAppSelector((state) => state.hr);

  const [page, setPage] = useState(1);
  const [rejectionNote, setRejectionNote] = useState("");
  const [selected, setSelected] = useState<{
    userId: string;
    step: VisaStepKey;
  } | null>(null);

  useEffect(() => {
    dispatch(fetchAllVisasThunk(page));
    dispatch(fetchAllApprovedOnboardings());
  }, [dispatch, page]);

  const handleApprove = async (userId: string, step: VisaStepKey) => {
    await dispatch(reviewVisa({ userId, step, status: "Approved" }));
    dispatch(fetchAllVisasThunk(page));
  };

  const handleReject = async () => {
    if (!selected) return;
    await dispatch(
      reviewVisa({
        userId: selected.userId,
        step: selected.step,
        status: "Rejected",
        feedback: rejectionNote,
      })
    );
    setSelected(null);
    setRejectionNote("");
  };

  const renderDocCell = (
    userId: string,
    step: VisaStepKey,
    file?: string,
    status?: string,
    feedback?: string
  ) => (
    <Box border="1px solid #ccc" p={2} borderRadius="md" minHeight="160px">
      <Typography level="body-sm" mb={1}>
        {step}
      </Typography>
      <Typography level="body-xs">
        Status: {status || "Not uploaded"}
      </Typography>

      {file && (
        <Stack direction="row" spacing={1} mt={1}>
          <Button
            size="sm"
            variant="outlined"
            component="a"
            href={file}
            target="_blank"
            sx={{ mt: 1 }}
          >
            Preview
          </Button>
          <Button
            size="sm"
            variant="soft"
            onClick={() => handleDownload(file, `${step}-${userId}.pdf`)}
          >
            Download
          </Button>
        </Stack>
      )}

      {status === "Pending" && (
        <Stack spacing={1} direction="row" mt={1}>
          <Button
            size="sm"
            color="success"
            onClick={() => handleApprove(userId, step)}
          >
            Approve
          </Button>
          <Button
            size="sm"
            color="danger"
            onClick={() => setSelected({ userId, step })}
          >
            Reject
          </Button>
        </Stack>
      )}

      {status === "Rejected" && feedback && (
        <Typography color="danger" mt={1}>
          Feedback: {feedback}
        </Typography>
      )}
    </Box>
  );

  return (
    <Box p={4}>
      <Typography level="h3" mb={3}>
        Visa Management
      </Typography>

      {loading ? (
        <Typography>Loading visas...</Typography>
      ) : (
        <>
          {visas.slice(0, 10).map((visa) => {
            const userId = getUserId(visa.userId);

            const onboarding = approvedOnboardings.find(
              (o) => getUserId(o.userId) === userId
            );

            const fullName = [
              onboarding?.firstName,
              onboarding?.middleName,
              onboarding?.lastName,
            ]
              .filter(Boolean)
              .join(" ");

            const startDate = onboarding?.usResidentStatus?.startDate || "N/A";
            const endDate = onboarding?.usResidentStatus?.endDate || "N/A";
            const workAuth = "F1(OPT/CPT)";

            let remainingDays = "N/A";
            if (onboarding?.usResidentStatus?.endDate) {
              const now = new Date();
              const end = new Date(onboarding.usResidentStatus.endDate);
              const diff = Math.ceil(
                (end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
              );
              remainingDays = diff >= 0 ? `${diff} days` : "Expired";
            }

            return (
              <Box
                key={visa._id}
                display="grid"
                gridTemplateColumns="1.5fr repeat(4, 1fr)"
                gap={2}
                alignItems="center"
                mb={2}
              >
                <Box>
                  <Typography level="title-sm">
                    {fullName || "Unknown User"}
                  </Typography>
                  <Typography level="body-xs">
                    {workAuth} <br />
                    {startDate} — {endDate} <br />
                    Remaining: {remainingDays}
                  </Typography>
                </Box>

                {renderDocCell(
                  userId,
                  "optReceipt",
                  visa.optReceipt?.file,
                  visa.optReceipt?.status,
                  visa.optReceipt?.feedback
                )}
                {renderDocCell(
                  userId,
                  "optEAD",
                  visa.optEAD?.file,
                  visa.optEAD?.status,
                  visa.optEAD?.feedback
                )}
                {renderDocCell(
                  userId,
                  "i983",
                  visa.i983?.file,
                  visa.i983?.status,
                  visa.i983?.feedback
                )}
                {renderDocCell(
                  userId,
                  "i20",
                  visa.i20?.file,
                  visa.i20?.status,
                  visa.i20?.feedback
                )}
              </Box>
            );
          })}

          {totalVisaPages > 1 && (
            <Stack direction="row" spacing={2} mt={4} justifyContent="center">
              <Button
                variant="outlined"
                disabled={page === 1}
                onClick={() => setPage((prev) => prev - 1)}
              >
                Previous
              </Button>
              <Typography level="body-md" mt={1}>
                Page {page} of {totalVisaPages}
              </Typography>
              <Button
                variant="outlined"
                disabled={page === totalVisaPages}
                onClick={() => setPage((prev) => prev + 1)}
              >
                Next
              </Button>
            </Stack>
          )}
        </>
      )}

      <Modal open={!!selected} onClose={() => setSelected(null)}>
        <ModalDialog>
          <Typography level="title-md" mb={1}>
            Enter Rejection Feedback
          </Typography>
          <Textarea
            minRows={2}
            placeholder="Reason for rejection"
            value={rejectionNote}
            onChange={(e) => setRejectionNote(e.target.value)}
          />
          <Stack direction="row" spacing={1} mt={2}>
            <Button onClick={handleReject}>Submit</Button>
            <Button variant="soft" onClick={() => setSelected(null)}>
              Cancel
            </Button>
          </Stack>
        </ModalDialog>
      </Modal>
    </Box>
  );
};

export default VisaManagementPage;
