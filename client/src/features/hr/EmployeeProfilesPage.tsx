import React, { useState, useEffect } from "react";
import {
  Box,
  Input,
  Button,
  Select,
  Option,
  Typography,
  List,
  ListItem,
  Divider,
  Stack,
  Sheet,
} from "@mui/joy";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchAllOnboardings, searchOnboardingByName } from "./hrSlice";
import PersonalInfoTabs from "../../components/personalInfoTabs/PersonalInfoTabs";

const EmployeeProfilesPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    onboardings,
    currentPage,
    totalPages,
    isSearching,
    searchQuery,
    loading,
  } = useAppSelector((state) => state.hr);

  const [searchType, setSearchType] = useState<
    "firstName" | "lastName" | "preferredName"
  >("firstName");
  const [inputValue, setInputValue] = useState("");
  const [viewingId, setViewingId] = useState<string | null>(null);

  useEffect(() => {
    if (isSearching) {
      dispatch(
        searchOnboardingByName({
          query: searchQuery,
          page: currentPage,
          field: searchType,
        })
      );
    } else {
      dispatch(fetchAllOnboardings(currentPage));
    }
  }, [dispatch, currentPage, isSearching, searchQuery, searchType]);

  const handleSearch = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) {
      dispatch(fetchAllOnboardings(1));
    } else {
      dispatch(
        searchOnboardingByName({ query: trimmed, page: 1, field: searchType })
      );
    }
  };

  const handlePageChange = (newPage: number) => {
    if (isSearching) {
      dispatch(
        searchOnboardingByName({
          query: searchQuery,
          page: newPage,
          field: searchType,
        })
      );
    } else {
      dispatch(fetchAllOnboardings(newPage));
    }
  };

  const resetSearch = () => {
    setInputValue("");
    dispatch(fetchAllOnboardings(1));
  };

  return (
    <Box p={4}>
      <Typography level="h3" mb={2}>
        Employee Profiles
      </Typography>

      {/* Search Section */}
      <Stack direction="row" spacing={2} mb={3} alignItems="center">
        <Select
          value={searchType}
          onChange={(_, value) => value && setSearchType(value)}
        >
          <Option value="firstName">First Name</Option>
          <Option value="lastName">Last Name</Option>
          <Option value="preferredName">Preferred Name</Option>
        </Select>
        <Input
          placeholder="Search name..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <Button onClick={handleSearch} loading={loading}>
          Search
        </Button>
        <Button variant="outlined" onClick={resetSearch} disabled={loading}>
          Reset
        </Button>
      </Stack>

      {/* Employee List */}
      <List sx={{ width: "100%", bgcolor: "background.surface" }}>
        {onboardings.map((o) => {
          const name = [o.firstName, o.middleName, o.lastName]
            .filter(Boolean)
            .join(" ");
          const workAuthTitle = o.usResidentStatus?.isCitizenOrResident
            ? o.usResidentStatus?.title
            : o.usResidentStatus?.otherTitle || "N/A";
          return (
            <React.Fragment key={o._id}>
              <ListItem>
                <Box width="100%">
                  <Typography
                    level="title-md"
                    component="button"
                    onClick={() => {
                      const id =
                        typeof o.userId === "string"
                          ? o.userId
                          : typeof o.userId === "object" &&
                            o.userId !== null &&
                            "_id" in o.userId
                          ? (o.userId as { _id: string })._id
                          : null;
                      setViewingId(id);
                    }}
                  >
                    <b>{name || "No Name"}</b>
                  </Typography>
                  <Typography level="body-sm">SSN: {o.ssn || "N/A"}</Typography>
                  <Typography level="body-sm">
                    Work Auth: {workAuthTitle}
                  </Typography>
                  <Typography level="body-sm">
                    Phone: {o.contact?.cellPhone || "N/A"}
                  </Typography>
                  <Typography level="body-sm">Email: {o.email}</Typography>
                </Box>
              </ListItem>
              <Divider />
            </React.Fragment>
          );
        })}
      </List>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <Stack direction="row" spacing={2} mt={3} justifyContent="center">
          <Button
            variant="outlined"
            disabled={currentPage === 1 || loading}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Previous
          </Button>
          <Typography level="body-md" mt={1}>
            Page {currentPage} of {totalPages}
          </Typography>
          <Button
            variant="outlined"
            disabled={currentPage === totalPages || loading}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next
          </Button>
        </Stack>
      )}

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
    </Box>
  );
};

export default EmployeeProfilesPage;
