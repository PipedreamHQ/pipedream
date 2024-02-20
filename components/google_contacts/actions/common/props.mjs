export default {
  firstName: (optional) => ({
    type: "string",
    label: "First Name",
    description: "Contact's first name",
    optional,
  }),
  middleName: (optional) => ({
    type: "string",
    label: "Middle Name",
    description: "Contact's middle name",
    optional,
  }),
  lastName: (optional) => ({
    type: "string",
    label: "Last Name",
    description: "Contact's last name",
    optional,
  }),
  email: (optional) => ({
    type: "string",
    label: "Email Address",
    description: "Contact's email address",
    optional,
  }),
  phoneNumber: (optional) => ({
    type: "string",
    label: "Phone Number",
    description: "Contact's phone number",
    optional,
  }),
  streetAddress: (optional) => ({
    type: "string",
    label: "Street Address",
    description: "Contact's street address",
    optional,
  }),
  city: (optional) => ({
    type: "string",
    label: "City",
    description: "Contact's city",
    optional,
  }),
  state: (optional) => ({
    type: "string",
    label: "State",
    description: "Contact's state/region",
    optional,
  }),
  zipCode: (optional) => ({
    type: "string",
    label: "Zip Code",
    description: "Contact's zip code",
    optional,
  }),
  country: (optional) => ({
    type: "string",
    label: "Country",
    description: "Contact's country",
    optional,
  }),
};
