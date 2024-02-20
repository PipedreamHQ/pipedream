export default {
  firstName: {
    type: "string",
    label: "First Name",
    description: "Contact's first name",
  },
  middleName: {
    type: "string",
    label: "Middle Name",
    description: "Contact's middle name",
  },
  lastName: {
    type: "string",
    label: "Last Name",
    description: "Contact's last name",
  },
  email: {
    type: "string",
    label: "Email Address",
    description: "Contact's email address",
  },
  phoneNumber: {
    type: "string",
    label: "Phone Number",
    description: "Contact's phone number",
  },
  streetAddress: {
    type: "string",
    label: "Street Address",
    description: "Contact's street address",
  },
  city: {
    type: "string",
    label: "City",
    description: "Contact's city",
  },
  state: {
    type: "string",
    label: "State",
    description: "Contact's state/region",
  },
  zipCode: {
    type: "string",
    label: "Zip Code",
    description: "Contact's zip code",
  },
  country: {
    type: "string",
    label: "Country",
    description: "Contact's country",
  },
  biography: {
    type: "string",
    label: "Biography",
    description: "Contact's biography",
  },
  birthday: {
    type: "string",
    label: "Birthday",
    description: "Contact's birthday, in `YYYY-MM-DD` format",
  },
  calendarUrl: {
    type: "string",
    label: "Calendar URL",
    description: "Contact's Calendar URL",
  },
  gender: {
    type: "string",
    label: "Gender",
    description: "Contact's gender",
    options: [
      "male",
      "female",
      "unspecified",
    ],
  },
  urls: {
    location: "string[]",
    label: "URLs",
    description: "The contact's associated URLs.",
  },
  additionalFields: {
    location: "object",
    label: "Additional Fields",
    description: "An object with additional fields to be included. Each value will be parsed as a JSON object, and keys that have the same name as other props will override them. [See the documentation](https://developers.google.com/people/api/rest/v1/people#resource:-person) for all available fields and their structure.",
    optional: true,
  },
};
