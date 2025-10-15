import postgrid from "../../postgrid.app.mjs";

export default {
  key: "postgrid-create-contact",
  name: "Create Contact",
  description: "Create a new contact in PostGrid. [See the documentation](https://docs.postgrid.com/#3ac81e66-c5be-4bb6-93c1-fd8a6f0a24b3)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    postgrid,
    firstName: {
      type: "string",
      label: "First Name",
      description: "The first name of the contact.",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The last name of the contact.",
      optional: true,
    },
    companyName: {
      type: "string",
      label: "Company Name",
      description: "The contact's company name.",
      optional: true,
    },
    addressLine1: {
      type: "string",
      label: "Address Line 1",
      description: "The contact's first address line.",
    },
    addressLine2: {
      type: "string",
      label: "Address Line 2",
      description: "The contact's second address line.",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "The contact's city.",
      optional: true,
    },
    provinceOrState: {
      type: "string",
      label: "Province or State",
      description: "The province or state of the contact.",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "The contact's email.",
      optional: true,
    },
    phoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "The contact's phone number.",
      optional: true,
    },
    jobTitle: {
      type: "string",
      label: "Job Title",
      description: "The contact's job title.",
      optional: true,
    },
    postalOrZip: {
      type: "string",
      label: "Postal or Zip",
      description: "The postal code or ZIP code of the contact.",
      optional: true,
    },
    countryCode: {
      type: "string",
      label: "Country Code",
      description: "The ISO 3611-1 country code of the contact's address. Defaults to CA.",
      default: "CA",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "A description for the contact.",
      optional: true,
    },
    skipVerification: {
      type: "boolean",
      label: "Skip Verification",
      description: "If true, skip address verification and mark the address as failed.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      postgrid,
      ...data
    } = this;

    const response = await postgrid.createContact({
      data,
      $,
    });

    if (response.id) {
      $.export("$summary", `Successfully created contact with ID ${response.id}.`);
    }

    return response;
  },
};
