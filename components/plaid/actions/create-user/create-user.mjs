import app from "../../plaid.app.mjs";

export default {
  key: "plaid-create-user",
  name: "Create User",
  description: "Creates a user ID and token to be used with Plaid Check, Income, or Multi-Item Link flow. [See the documentation](https://plaid.com/docs/api/users/#usercreate).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    clientUserId: {
      type: "string",
      label: "Client User ID",
      description: "A unique ID representing the end user. Maximum of 128 characters. Typically this will be a user ID number from your application. Personally identifiable information, such as an email address or phone number, should not be used in the client_user_id.",
      optional: false,
    },
    includeConsumerReportUserIdentity: {
      type: "boolean",
      label: "Include Consumer Report User Identity",
      description: "Whether to include the consumer report user identity. This is required for all Plaid Check customers.",
      optional: true,
      reloadProps: true,
    },
  },
  additionalProps() {
    if (!this.includeConsumerReportUserIdentity) {
      return {};
    }

    return {
      firstName: {
        type: "string",
        label: "First Name",
        description: "The user's first name",
      },
      lastName: {
        type: "string",
        label: "Last Name",
        description: "The user's last name",
      },
      phoneNumbers: {
        type: "string[]",
        label: "Phone Numbers",
        description: "The user's phone number, in E.164 format: +{countrycode}{number}. For example: `+14157452130`. Phone numbers provided in other formats will be parsed on a best-effort basis. Phone number input is validated against valid number ranges; number strings that do not match a real-world phone numbering scheme may cause the request to fail, even in the Sandbox test environment.",
      },
      emails: {
        type: "string[]",
        label: "Emails",
        description: "The user's emails",
      },
      ssnLast4: {
        type: "string",
        label: "SSN Last 4",
        description: "The last 4 digits of the user's social security number.",
        optional: true,
      },
      dateOfBirth: {
        type: "string",
        label: "Date of Birth",
        description: "To be provided in the format `yyyy-mm-dd`. This field is required for all Plaid Check customers.",
      },
      primaryAddressCity: {
        type: "string",
        label: "City",
        description: "The full city name for the primary address",
      },
      primaryAddressRegion: {
        type: "string",
        label: "Region/State",
        description: "The region or state. Example: `NC`",
      },
      primaryAddressStreet: {
        type: "string",
        label: "Street",
        description: "The full street address. Example: `564 Main Street, APT 15`",
      },
      primaryAddressPostalCode: {
        type: "string",
        label: "Postal Code",
        description: "The postal code",
      },
      primaryAddressCountry: {
        type: "string",
        label: "Country",
        description: "The ISO 3166-1 alpha-2 country code",
      },
    };
  },
  async run({ $ }) {
    const {
      app,
      clientUserId,
      includeConsumerReportUserIdentity,
      firstName,
      lastName,
      phoneNumbers,
      emails,
      ssnLast4,
      dateOfBirth,
      primaryAddressCity,
      primaryAddressRegion,
      primaryAddressStreet,
      primaryAddressPostalCode,
      primaryAddressCountry,
    } = this;

    const response = await app.createUser({
      client_user_id: clientUserId,
      ...(includeConsumerReportUserIdentity
        ? {
          consumer_report_user_identity: {
            first_name: firstName,
            last_name: lastName,
            phone_numbers: phoneNumbers,
            emails: emails,
            date_of_birth: dateOfBirth,
            ssn_last_4: ssnLast4,
            primary_address: {
              city: primaryAddressCity,
              region: primaryAddressRegion,
              street: primaryAddressStreet,
              postal_code: primaryAddressPostalCode,
              country: primaryAddressCountry,
            },
          },
        }
        : {}
      ),
    });

    $.export("$summary", `Successfully created user with ID \`${response.user_id}\`.`);

    return response;
  },
};
