import React, { useEffect, useRef, useState } from "react";
import {
  Tabs,
  TabList,
  Tab,
  TabPanel,
  Typography,
  Button,
  Box,
} from "@mui/joy";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import Panel0 from "./Panel0";
import Panel1 from "./Panel1";
import Panel2 from "./Panel2";
import Panel3 from "./Panel3";
import Panel4 from "./Panel4";
import Panel5 from "./Panel5";
import Panel6 from "./Panel6";
import Panel7 from "./Panel7";
import Panel8 from "./Panel8";
import {
  fetchOnboarding,
  submitOnboarding,
  updateOnboarding,
} from "../../features/onboarding/onboardingSlice";

const initialReference = {
  firstName: "",
  lastName: "",
  middleName: "",
  phone: "",
  email: "",
  relationship: "",
};

const initialEmergencyContact = {
  firstName: "",
  lastName: "",
  middleName: "",
  phone: "",
  email: "",
  relationship: "",
};

interface Props {
  userId?: string;
  readonly?: boolean;
}

const PersonalInfoTabs: React.FC<Props> = ({ userId, readonly = false }) => {
  const dispatch = useAppDispatch();
  const onboarding = useAppSelector((state) => state.onboarding.data);
  const isReadonly = readonly || onboarding?.status === "Pending";

  const {
    user,
    loading,
    email: registeredEmail,
  } = useAppSelector((state) => state.auth);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [firstname, setFirstname] = useState("");
  const [middlename, setMiddlename] = useState("");
  const [lastname, setLastname] = useState("");
  const [preferredname, setPreferredname] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [building, setBuilding] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [cellPhone, setCellPhone] = useState("");
  const [workPhone, setWorkPhone] = useState("");
  const [email, setEmail] = useState("");
  const [ssn, setSsn] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "prefer_not_to_say">(
    "male"
  );
  const [isCitizenOrResident, setIsCitizenOrResident] = useState<
    "yes" | "no" | ""
  >("");
  const [residentTitle, setResidentTitle] = useState<
    "Green Card" | "Citizen" | ""
  >("");
  const [visaType, setVisaType] = useState<
    "H1-B" | "L2" | "F1(CPT/OPT)" | "H4" | "Other" | ""
  >("");
  const [otherTitle, setOtherTitle] = useState("");
  const [optReceipt, setOptReceipt] = useState<File | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showReference, setShowReference] = useState(false);
  const [profilePicUrl, setProfilePicUrl] = useState("");
  const [driverLicenseUrl, setDriverLicenseUrl] = useState("");
  const [workAuthUrl, setWorkAuthUrl] = useState("");
  const [profilePicFile, setProfilePicFile] = useState<File | null>(null);
  const [driverLicenseFile, setDriverLicenseFile] = useState<File | null>(null);
  const [workAuthFile, setWorkAuthFile] = useState<File | null>(null);

  const [reference, setReference] = useState(initialReference);
  const [emergencyContacts, setEmergencyContacts] = useState([
    { ...initialEmergencyContact },
  ]);

  useEffect(() => {
    console.log("📸 profilePicFile in parent:", profilePicFile);
  }, [profilePicFile]);

  useEffect(() => {
    const idToFetch = userId || user?._id;
    if (!idToFetch) return;
    dispatch(fetchOnboarding(idToFetch));
  }, [dispatch, userId, user]);

  useEffect(() => {
    if (onboarding) {
      setFirstname(onboarding.firstName || "");
      setMiddlename(onboarding.middleName || "");
      setLastname(onboarding.lastName || "");
      setPreferredname(onboarding.preferredName || "");
      setEmail(onboarding.email || "");
      setSsn(onboarding.ssn || "");
      setDob(onboarding.dob || "");
      setGender(onboarding.gender || "male");
      setBuilding(onboarding.address?.building || "");
      setStreet(onboarding.address?.street || "");
      setCity(onboarding.address?.city || "");
      setState(onboarding.address?.state || "");
      setZip(onboarding.address?.zip || "");
      setCellPhone(onboarding.contact?.cellPhone || "");
      setWorkPhone(onboarding.contact?.workPhone || "");
      setReference({
        ...initialReference,
        ...onboarding.reference,
      });
      if (
        onboarding.emergencyContacts &&
        onboarding.emergencyContacts.length > 0
      ) {
        const normalized = onboarding.emergencyContacts.map((contact) => ({
          ...initialEmergencyContact,
          ...contact,
        }));
        setEmergencyContacts(normalized);
      } else {
        setEmergencyContacts([{ ...initialEmergencyContact }]);
      }

      setProfilePicUrl(onboarding.profilePic || "");
      setDriverLicenseUrl(onboarding.documents?.driverLicense || "");
      setWorkAuthUrl(onboarding.documents?.workAuth || "");

      const status = onboarding.usResidentStatus;
      if (status) {
        setIsCitizenOrResident(status.isCitizenOrResident ? "yes" : "no");
        setResidentTitle(status.title || "");
        setVisaType(status.visaType || "");
        setOtherTitle(status.otherTitle || "");
        setStartDate(status.startDate || "");
        setEndDate(status.endDate || "");
      }
    } else if (!onboarding && user?.email) {
      setEmail(user.email);
    }
  }, [onboarding, registeredEmail]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();

    if (user?._id) {
      formData.append("userId", user._id);
    }

    formData.append("firstName", firstname);
    formData.append("middleName", middlename);
    formData.append("lastName", lastname);
    formData.append("preferredName", preferredname);
    formData.append("email", email);
    formData.append("ssn", ssn);
    formData.append("dob", dob);
    formData.append("gender", gender);

    formData.append(
      "address",
      JSON.stringify({ building, street, city, state, zip })
    );

    formData.append("contact", JSON.stringify({ cellPhone, workPhone }));

    formData.append(
      "usResidentStatus",
      JSON.stringify({
        isCitizenOrResident: isCitizenOrResident === "yes",
        title: residentTitle || undefined,
        visaType: visaType || undefined,
        otherTitle,
        startDate,
        endDate,
      })
    );

    formData.append("reference", JSON.stringify(reference));
    formData.append("emergencyContacts", JSON.stringify(emergencyContacts));

    console.log("📎 Appending profilePicFile:", profilePicFile);

    if (optReceipt) formData.append("optReceipt", optReceipt);
    if (profilePicFile) formData.append("profilePic", profilePicFile);
    if (driverLicenseFile) {
      const ext = driverLicenseFile.name.endsWith(".pdf") ? "" : ".pdf";
      const renamed = new File([driverLicenseFile], `driverlicense${ext}`, {
        type: driverLicenseFile.type,
      });
      formData.append("driverLicense", renamed);
    }
    if (workAuthFile) {
      const ext = workAuthFile.name.endsWith(".pdf") ? "" : ".pdf";
      const renamed = new File([workAuthFile], `workauthorization${ext}`, {
        type: workAuthFile.type,
      });
      formData.append("workAuth", renamed);
    }

    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    dispatch(submitOnboarding(formData));
  };

  const handleResubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    if (user?._id) {
      formData.append("userId", user._id);
    }

    formData.append("firstName", firstname);
    formData.append("middleName", middlename);
    formData.append("lastName", lastname);
    formData.append("preferredName", preferredname);
    formData.append("email", email);
    formData.append("ssn", ssn);
    formData.append("dob", dob);
    formData.append("gender", gender);

    formData.append(
      "address",
      JSON.stringify({ building, street, city, state, zip })
    );
    formData.append("contact", JSON.stringify({ cellPhone, workPhone }));
    formData.append(
      "usResidentStatus",
      JSON.stringify({
        isCitizenOrResident: isCitizenOrResident === "yes",
        title: residentTitle || undefined,
        visaType: visaType || undefined,
        otherTitle,
        startDate,
        endDate,
      })
    );
    formData.append("reference", JSON.stringify(reference));
    formData.append("emergencyContacts", JSON.stringify(emergencyContacts));

    if (optReceipt) formData.append("optReceipt", optReceipt);
    if (profilePicFile) formData.append("profilePic", profilePicFile);
    if (driverLicenseFile) {
      const ext = driverLicenseFile.name.endsWith(".pdf") ? "" : ".pdf";
      const renamed = new File([driverLicenseFile], `driverlicense${ext}`, {
        type: driverLicenseFile.type,
      });
      formData.append("driverLicense", renamed);
    }
    if (workAuthFile) {
      const ext = workAuthFile.name.endsWith(".pdf") ? "" : ".pdf";
      const renamed = new File([workAuthFile], `workauthorization${ext}`, {
        type: workAuthFile.type,
      });
      formData.append("workAuth", renamed);
    }

    dispatch(updateOnboarding({ userId: user?._id || "", formData }));
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleEmergencyChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const updated = [...emergencyContacts];
    updated[index][field as keyof (typeof updated)[0]] = value;
    setEmergencyContacts(updated);
  };

  const addEmergencyContact = () => {
    setEmergencyContacts([
      ...emergencyContacts,
      {
        firstName: "",
        lastName: "",
        middleName: "",
        phone: "",
        email: "",
        relationship: "",
      },
    ]);
  };

  const removeEmergencyContact = (index: number) => {
    const updated = emergencyContacts.filter((_, i) => i !== index);
    setEmergencyContacts(updated);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <Typography level="h4" component="h1">
          <b>Personal Info</b>
        </Typography>
      </div>
      <Box
        sx={{
          display: "flex",
          width: "100%",
          gap: 5,
        }}
      >
        <Tabs
          aria-label="Vertical tabs"
          orientation="vertical"
          sx={{ minWidth: { xs: "100%", sm: 500 } }}
        >
          <TabList size="lg">
            <Tab>Name</Tab>
            <Tab>Picture</Tab>
            <Tab>Address</Tab>
            <Tab>Phone Number</Tab>
            <Tab>Email</Tab>
            <Tab>Info</Tab>
            <Tab>Visa</Tab>
            <Tab>Reference</Tab>
            <Tab>Files & Documents</Tab>
          </TabList>
          <Box sx={{ flex: 1 }}>
            <TabPanel value={0}>
              <Panel0
                firstname={firstname}
                setFirstname={setFirstname}
                middlename={middlename}
                setMiddlename={setMiddlename}
                lastname={lastname}
                setLastname={setLastname}
                preferredname={preferredname}
                setPreferredname={setPreferredname}
                readonly={isReadonly}
              />
            </TabPanel>
            <TabPanel value={1}>
              <Panel1
                imagePreview={imagePreview}
                setImagePreview={setImagePreview}
                setProfilePicUrl={setProfilePicUrl}
                setProfilePicFile={setProfilePicFile}
                readonly={isReadonly}
              />
            </TabPanel>
            <TabPanel value={2}>
              <Panel2
                building={building}
                street={street}
                city={city}
                state={state}
                zip={zip}
                setBuilding={setBuilding}
                setStreet={setStreet}
                setCity={setCity}
                setState={setState}
                setZip={setZip}
                readonly={isReadonly}
              />
            </TabPanel>
            <TabPanel value={3}>
              <Panel3
                cellPhone={cellPhone}
                workPhone={workPhone}
                setCellPhone={setCellPhone}
                setWorkPhone={setWorkPhone}
                readonly={isReadonly}
              />
            </TabPanel>
            <TabPanel value={4}>
              <Panel4 email={email} />
            </TabPanel>
            <TabPanel value={5}>
              <Panel5
                ssn={ssn}
                dob={dob}
                gender={gender}
                setSsn={setSsn}
                setDob={setDob}
                setGender={setGender}
                readonly={isReadonly}
              />
            </TabPanel>
            <TabPanel value={6}>
              <Panel6
                isCitizenOrResident={isCitizenOrResident}
                residentTitle={residentTitle}
                visaType={visaType}
                otherTitle={otherTitle}
                optReceipt={optReceipt}
                startDate={startDate}
                endDate={endDate}
                setIsCitizenOrResident={setIsCitizenOrResident}
                setResidentTitle={setResidentTitle}
                setVisaType={setVisaType}
                setOtherTitle={setOtherTitle}
                setOptReceipt={setOptReceipt}
                setStartDate={setStartDate}
                setEndDate={setEndDate}
                fileInputRef={fileInputRef}
                handleUploadClick={handleUploadClick}
                readonly={isReadonly}
              />
            </TabPanel>
            <TabPanel value={7}>
              <Panel7
                reference={reference}
                setReference={setReference}
                showReference={showReference}
                setShowReference={setShowReference}
                emergencyContacts={emergencyContacts}
                handleEmergencyChange={handleEmergencyChange}
                addEmergencyContact={addEmergencyContact}
                removeEmergencyContact={removeEmergencyContact}
                readonly={isReadonly}
              />
            </TabPanel>
            <TabPanel value={8}>
              <Panel8
                profilePicUrl={profilePicUrl}
                setProfilePicUrl={setProfilePicUrl}
                setProfilePicFile={setProfilePicFile}
                driverLicenseUrl={driverLicenseUrl}
                setDriverLicenseUrl={setDriverLicenseUrl}
                setDriverLicenseFile={setDriverLicenseFile}
                workAuthUrl={workAuthUrl}
                setWorkAuthUrl={setWorkAuthUrl}
                setWorkAuthFile={setWorkAuthFile}
                readonly={isReadonly}
              />
            </TabPanel>
          </Box>
        </Tabs>
      </Box>

      {!isReadonly && onboarding?.status !== "Approved" && (
        <Button
          type="submit"
          sx={{ mt: 1 }}
          disabled={loading}
          onClick={
            onboarding?.status === "Rejected" ? handleResubmit : handleSubmit
          }
        >
          {loading
            ? "Loading..."
            : onboarding?.status === "Rejected"
            ? "Resubmit"
            : "Submit"}
        </Button>
      )}
    </form>
  );
};

export default PersonalInfoTabs;
