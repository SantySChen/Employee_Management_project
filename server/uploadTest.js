const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const path = require("path");

(async () => {
  try {
    const form = new FormData();

    // Required fields (simulate minimal onboarding data)
    form.append("userId", "64fd123abc456def7890abcd"); // Use a real ObjectId from your DB if needed
    form.append("email", "test@example.com");
    form.append("firstName", "Test");
    form.append("lastName", "User");
    form.append("gender", "prefer_not_to_say");

    // Required nested fields (JSON)
    form.append("address", JSON.stringify({
      building: "123",
      street: "Main St",
      city: "Testville",
      state: "CA",
      zip: "12345"
    }));

    form.append("contact", JSON.stringify({
      cellPhone: "123-456-7890"
    }));

    form.append("usResidentStatus", JSON.stringify({
      isCitizenOrResident: false,
      visaType: "F1(CPT/OPT)",
      startDate: "2023-01-01",
      endDate: "2024-01-01"
    }));

    form.append("reference", JSON.stringify({
      firstName: "Ref",
      lastName: "Erence",
      phone: "111-222-3333",
      email: "ref@example.com",
      relationship: "Manager"
    }));

    form.append("emergencyContacts", JSON.stringify([
      {
        firstName: "Jane",
        lastName: "Doe",
        phone: "999-888-7777",
        email: "jane@example.com",
        relationship: "Friend"
      }
    ]));

    // Attach file
    const testFilePath = path.join(__dirname, "test-files", "test-image.jpg");
    form.append("profilePic", fs.createReadStream(testFilePath));

    const response = await axios.post("http://localhost:8080/api/onboarding", form, {
      headers: {
        ...form.getHeaders(),
      },
    });

    console.log("✅ Upload successful. Server responded with:");
    console.log(response.data);
  } catch (error) {
    console.error("❌ Upload failed:");
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Response:", error.response.data);
    } else {
      console.error(error.message);
    }
  }
})();

