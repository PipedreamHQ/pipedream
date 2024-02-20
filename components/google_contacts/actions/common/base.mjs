import googleContacts from "../../google_contacts.app.mjs";
import props from "./props.mjs";

export default {
  props: {
    googleContacts,
  },
  methods: {
    getPersonFieldProps(personFields, optional = false) {
      const result = {};
      if (personFields.includes("names")) {
        result.firstName = props.firstName(optional);
        result.middleName = props.middleName(optional);
        result.lastName = props.lastName(optional);
      }
      if (personFields.includes("emailAddresses")) {
        result.email = props.email(optional);
      }
      if (personFields.includes("phoneNumbers")) {
        result.phoneNumber = props.phoneNumber(optional);
      }
      if (personFields.includes("addresses")) {
        result.streetAddress = props.streetAddress(optional);
        result.city = props.city(optional);
        result.state = props.state(optional);
        result.zipCode = props.zipCode(optional);
        result.country = props.country(optional);
      }
      return result;
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
