import googleContacts from "../../google_contacts.app.mjs";

export default {
  props: {
    googleContacts,
  },
  methods: {
    getPersonFieldProps(personFields, optional = false) {
      const props = {};
      if (personFields.includes("names")) {
        props.firstName = {
          type: "string",
          label: "First Name",
          description: "Contact's first name",
          optional,
        };
        props.middleName = {
          type: "string",
          label: "Middle Name",
          description: "Contact's middle name",
          optional,
        };
        props.lastName = {
          type: "string",
          label: "Last Name",
          description: "Contact's last name",
          optional,
        };
      }
      if (personFields.includes("emailAddresses")) {
        props.email = {
          type: "string",
          label: "Email Address",
          description: "Contact's email address",
          optional,
        };
      }
      if (personFields.includes("phoneNumbers")) {
        props.phoneNumber = {
          type: "string",
          label: "Phone Number",
          description: "Contact's phone number",
          optional,
        };
      }
      if (personFields.includes("addresses")) {
        props.streetAddress = {
          type: "string",
          label: "Street Address",
          description: "Contact's street address",
          optional,
        };
        props.city = {
          type: "string",
          label: "City",
          description: "Contact's city",
          optional,
        };
        props.state = {
          type: "string",
          label: "State",
          description: "Contact's state/region",
          optional,
        };
        props.zipCode = {
          type: "string",
          label: "Zip Code",
          description: "Contact's zip code",
          optional,
        };
        props.country = {
          type: "string",
          label: "Country",
          description: "Contact's country",
          optional,
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
