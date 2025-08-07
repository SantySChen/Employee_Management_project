import {
  Button,
  CssBaseline,
  FormControl,
  FormLabel,
  Input,
  Sheet,
  Typography,
  Box,
  Stack,
  Modal,
  ModalDialog,
  Textarea,
} from "@mui/joy";
import MailIcon from "@mui/icons-material/Mail";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  inviteEmployee,
  changeStatus,
  fetchOnboardingsByStatus,
  moveOnboardingToStatus,
} from "./hrSlice";
import PersonalInfoTabs from "../../components/personalInfoTabs/PersonalInfoTabs";
import { createVisaThunk } from "../visa/visaSlice";
import type { Onboarding } from "../onboarding/types";

const HiringManagementPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { onboardingsByStatus, searchResults, isSearching, error, success } =
    useAppSelector((state) => state.hr);

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [viewingId, setViewingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [rejectingId, setRejectingId] = useState<Onboarding | null>(null);

  useEffect(() => {
    ["Pending", "Approved", "Rejected"].forEach((status) => {
      dispatch(fetchOnboardingsByStatus({ status }));
    });
  }, [dispatch]);

  const validateEmailFormat = (value: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError("");
    if (!validateEmailFormat(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    dispatch(inviteEmployee(email));
  };

  const handleStatusChange = async (
  onboard: Onboarding, 
  newStatus: "Approved" | "Rejected",
  note?: string
) => {
  if (!onboard._id) return;

  await dispatch(moveOnboardingToStatus({ id: onboard._id, newStatus }));
  await dispatch(changeStatus({ id: onboard._id, status: newStatus, feedback: note }));

  if (
    newStatus === "Approved" &&
    onboard.usResidentStatus?.visaType === "F1(CPT/OPT)" &&
    onboard.userId &&
    onboard.usResidentStatus?.optReceipt
  ) {
    await dispatch(
      createVisaThunk({
        userId: typeof onboard.userId === "string" ? onboard.userId : onboard.userId._id,
        optReceiptFile: onboard.usResidentStatus.optReceipt,
      })
    );
  }

  setShowModal(false);
  setRejectingId(null);
  setFeedback("");
};

  const renderList = (status: "Pending" | "Approved" | "Rejected") => {
    const pageData = onboardingsByStatus[status];
    const data = isSearching
      ? searchResults.filter((o) => o.status === status)
      : pageData.data;

    const handlePageChange = (direction: "next" | "prev") => {
      const newPage =
        direction === "next"
          ? pageData.currentPage + 1
          : Math.max(1, pageData.currentPage - 1);
      dispatch(fetchOnboardingsByStatus({ status, page: newPage }));
    };

    return (
      <Box width="100%">
        <Typography level="title-lg" mb={1}>
          {status}
        </Typography>
        <Stack spacing={1}>
          {data.map((onboard) => (
            <Box
              key={onboard._id}
              borderRadius={"sm"}
              p={2}
              border={"1px solid #ccc"}
            >
              <Typography>
                <b>Full Name:</b> {onboard.firstName} {onboard.middleName}{" "}
                {onboard.lastName}
              </Typography>
              <Typography>
                <b>Email:</b> {onboard.email}
              </Typography>
              <Stack direction="row" spacing={1} mt={1}>
                <Button
                  size="sm"
                  onClick={() => {
                    const id =
                      typeof onboard.userId === "string"
                        ? onboard.userId
                        : typeof onboard.userId === "object" &&
                          onboard.userId !== null &&
                          "_id" in onboard.userId
                        ? (onboard.userId as { _id: string })._id
                        : null;
                    setViewingId(id);
                  }}
                >
                  View Application
                </Button>
                {status === "Pending" && (
                  <>
                    <Button
                      size="sm"
                      color="success"
                      onClick={() =>
                        onboard._id &&
                        handleStatusChange(onboard, "Approved")
                      }
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      color="danger"
                      onClick={() => {
                        setRejectingId(onboard);
                        setShowModal(true);
                      }}
                    >
                      Reject
                    </Button>
                  </>
                )}
              </Stack>
            </Box>
          ))}
        </Stack>

        {/* Pagination Buttons */}
        {!isSearching && (
          <Stack direction="row" spacing={1} mt={2}>
            <Button
              size="sm"
              onClick={() => handlePageChange("prev")}
              disabled={pageData.currentPage === 1}
            >
              Prev
            </Button>
            <Typography level="body-sm">Page {pageData.currentPage}</Typography>
            <Button
              size="sm"
              onClick={() => handlePageChange("next")}
              disabled={pageData.currentPage >= pageData.totalPages}
            >
              Next
            </Button>
          </Stack>
        )}
      </Box>
    );
  };

  return (
    <main>
      <CssBaseline />

      {/* Invite Form */}
      <Sheet
        sx={{
          width: 400,
          mx: "auto",
          my: 4,
          py: 3,
          px: 3,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          borderRadius: "sm",
          boxShadow: "md",
        }}
        variant="outlined"
      >
        <Typography level="h4" component="h1" textAlign="center">
          <b>Invite New Employee</b>
        </Typography>

        <form onSubmit={handleSubmit}>
          <FormControl>
            <FormLabel>Email Address</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              startDecorator={<MailIcon />}
              endDecorator={<Button type="submit">Invite</Button>}
              placeholder="example@email.com"
            />
          </FormControl>
          {(emailError || error) && (
            <Typography level="body-sm" color="danger" mt={1}>
              {emailError || error}
            </Typography>
          )}
          {success && (
            <Typography level="body-sm" color="success" mt={1}>
              Invitation sent successfully!
            </Typography>
          )}
        </form>
      </Sheet>

      {/* Onboarding Lists by Status */}
      <Box display="flex" gap={3} px={3} py={2}>
        {renderList("Pending")}
        {renderList("Approved")}
        {renderList("Rejected")}
      </Box>

      {/* Application Viewer */}
      {viewingId && (
        <Sheet
          sx={{
            position: "fixed",
            top: 100,
            left: 50,
            right: 50,
            bottom: 50,
            zIndex: 1200,
            bgcolor: "background.body",
            p: 3,
            borderRadius: "md",
            boxShadow: "lg",
            overflow: "auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Button
            onClick={() => setViewingId(null)}
            color="neutral"
            sx={{ mb: 2 }}
          >
            Close
          </Button>
          <PersonalInfoTabs userId={viewingId} readonly={true} />
        </Sheet>
      )}

      {/* Reject Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <ModalDialog>
          <Typography>Rejection Reason</Typography>
          <Textarea
            minRows={3}
            placeholder="Enter feedback..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
          <Button
            onClick={() =>
              rejectingId &&
              handleStatusChange(rejectingId, "Rejected", feedback)
            }
          >
            Submit Rejection
          </Button>
        </ModalDialog>
      </Modal>
    </main>
  );
};

export default HiringManagementPage;
