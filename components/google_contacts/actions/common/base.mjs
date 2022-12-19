import googleContacts from "../../google_contacts.app.mjs";

export default {
  props: {
    googleContacts,
  },
  methods: {
    getPersonFieldProps(personFields) {
      const props = {};
      if (personFields.includes("names")) {
        props.firstName = {
          type: "string",
          label: "First Name",
          description: "Contact's first name",
        };
        props.middleName = {
          type: "string",
          label: "Middle Name",
          description: "Contact's middle name",
        };
        props.lastName = {
          type: "string",
          label: "Last Name",
          description: "Contact's last name",
        };
      }
      if (personFields.includes("emailAddresses")) {
        props.email = {
          type: "string",
          label: "Email Address",
          description: "Contact's email address",
        };
      }
      if (personFields.includes("phoneNumbers")) {
        props.phoneNumber = {
          type: "string",
          label: "Phone Number",
          description: "Contact's phone number",
        };
      }
      if (personFields.includes("addresses")) {
        props.streetAddress = {
          type: "string",
          label: "Street Address",
          description: "Contact's street address",
        };
        props.city = {
          type: "string",
          label: "City",
          description: "Contact's city",
        };
        props.state = {
          type: "string",
          label: "State",
          description: "Contact's state/region",
        };
        props.zipCode = {
          type: "string",
          label: "Zip Code",
          description: "Contact's zip code",
        };
        props.country = {
          type: "string",
          label: "Country",
          description: "Contact's country",
        };
      }
      return props;
    },
    getRequestBody(personFields, ctx) {
      const {
        firstName,
        middleName,
        lastName,
        email,
        phoneNumber,
        streetAddress,
        city,
        state: region,
        zipCode: postalCode,
        country,
      } = ctx;

      const requestBody = {};
      if (personFields.includes("addresses")) {
        requestBody.addresses = [
          {
            streetAddress,
            city,
            region,
            postalCode,
            country,
          },
        ];
      }
      if (personFields.includes("emailAddresses")) {
        requestBody.emailAddresses = [
          {
            value: email,
          },
        ];
      }
      if (personFields.includes("names")) {
        requestBody.names = [
          {
            familyName: lastName,
            middleName,
            givenName: firstName,
          },
        ];
      }
      if (personFields.includes("phoneNumbers")) {
        requestBody.phoneNumbers = [
          {
            value: phoneNumber,
          },
        ];
      }
      return requestBody;
    },
  },
  async run({ $ }) {
    const client = this.googleContacts.getClient();
    const results = await this.processResults(client);
    this.emitSummary($, results);
    return results;
  },
};
