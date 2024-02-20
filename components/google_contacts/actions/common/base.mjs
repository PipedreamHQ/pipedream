import googleContacts from "../../google_contacts.app.mjs";
import props from "./props.mjs";

export default {
  props: {
    googleContacts,
  },
  methods: {
    getPersonFieldProps(personFields) {
      const result = {};
      if (personFields.includes("names")) {
        result.firstName = props.firstName;
        result.middleName = props.middleName;
        result.lastName = props.lastName;
      }
      if (personFields.includes("emailAddresses")) {
        result.email = props.email;
      }
      if (personFields.includes("phoneNumbers")) {
        result.phoneNumber = props.phoneNumber;
      }
      if (personFields.includes("addresses")) {
        result.streetAddress = props.streetAddress;
        result.city = props.city;
        result.state = props.state;
        result.zipCode = props.zipCode;
        result.country = props.country;
      }
      if (personFields.includes("biographies")) {
        result.biography = props.biography;
      }
      if (personFields.includes("birthdays")) {
        result.birthday = props.birthday;
      }
      if (personFields.includes("calendarUrls")) {
        result.calendarUrl = props.calendarUrl;
      }
      if (personFields.includes("genders")) {
        result.gender = props.gender;
      }
      if (personFields.includes("urls")) {
        result.urls = props.urls;
      }
      result.additionalFields = props.additionalFields;
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
        biography,
        birthday,
        calendarUrl,
        gender,
        urls,
        additionalFields,
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
      if (personFields.includes("biographies")) {
        requestBody.biographies = [
          {
            value: biography,
          },
        ];
      }
      if (personFields.includes("birthdays")) {
        const [
          year,
          month,
          day,
        ] = birthday.split("-");
        requestBody.birthdays = [
          {
            date: {
              year,
              month,
              day,
            },
          },
        ];
      }
      if (personFields.includes("calendarUrls")) {
        requestBody.calendarUrls = [
          {
            url: calendarUrl,
          },
        ];
      }
      if (personFields.includes("genders")) {
        requestBody.genders = [
          {
            value: gender,
          },
        ];
      }
      if (personFields.includes("urls")) {
        requestBody.urls = urls.map((value) => ({
          value,
        }));
      }
      if (additionalFields) {
        Object.entries(additionalFields).forEach(([
          key,
          value,
        ]) => {
          try {
            requestBody[key] = JSON.parse(value);
          } catch (e) {
            requestBody[key] = value;
          }
        });
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
