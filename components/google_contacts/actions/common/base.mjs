import { ConfigurationError } from "@pipedream/platform";
import googleContacts from "../../google_contacts.app.mjs";

export default {
  props: {
    googleContacts,
  },
  methods: {
    getRequestBody(ctx) {
      const {
        firstName, middleName, lastName,
        email, phoneNumber,
        streetAddress, city, state: region, zipCode: postalCode, country,
        biography, birthday, calendarUrl, gender, urls,
        additionalFields,
      } = ctx;

      const requestBody = {};

      if (firstName || middleName || lastName) {
        requestBody.names = [
          {
            givenName: firstName,
            middleName,
            familyName: lastName,
          },
        ];
      }
      if (email) {
        requestBody.emailAddresses = [
          {
            value: email,
          },
        ];
      }
      if (phoneNumber) {
        requestBody.phoneNumbers = [
          {
            value: phoneNumber,
          },
        ];
      }
      if (streetAddress || city || region || postalCode || country) {
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
      if (biography) {
        requestBody.biographies = [
          {
            value: biography,
          },
        ];
      }
      if (birthday) {
        try {
          const [
            year,
            month,
            day,
          ] = birthday.split("-");
          requestBody.birthdays = [
            {
              date: {
                year: Number(year),
                month: Number(month),
                day: Number(day),
              },
            },
          ];
        } catch (err) {
          throw new ConfigurationError("Error parsing birthday. Make sure it is a string in the format `YYYY-MM-DD`");
        }
      }
      if (calendarUrl) {
        requestBody.calendarUrls = [
          {
            url: calendarUrl,
          },
        ];
      }
      if (gender) {
        requestBody.genders = [
          {
            value: gender,
          },
        ];
      }
      if (urls?.length) {
        requestBody.urls = urls.map((value) => ({
          value,
        }));
      }
      if (additionalFields) {
        Object.assign(requestBody, additionalFields);
      }
      return requestBody;
    },

    getPersonFields(requestBody) {
      return Object.keys(requestBody)
        .filter((key) => key !== "etag")
        .join(",");
    },
  },
  async run({ $ }) {
    const client = this.googleContacts.getClient();
    const results = await this.processResults(client);
    this.emitSummary($, results);
    return results;
  },
};
