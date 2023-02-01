import nordigen from "../../nordigen.app.mjs";

export default {
  key: "nordigen-get-account-metadata",
  name: "Get Account Metadata",
  description: "Get the details of a Nordigen account. [See the docs](https://ob.nordigen.com/api/docs#/accounts/accounts_details_retrieve)",
  version: "0.0.1",
  type: "action",
  props: {
    nordigen,
    countryCode: {
      propDefinition: [
        nordigen,
        "countryCode",
      ],
    },
    institutionId: {
      propDefinition: [
        nordigen,
        "institutionId",
        (({ countryCode }) => ({
          countryCode,
        })),
      ],
    },
    accessValidForDays: {
      propDefinition: [
        nordigen,
        "accessValidForDays",
      ],
    },
    maxHistoricalDays: {
      propDefinition: [
        nordigen,
        "maxHistoricalDays",
      ],
    },
  },
  async run() {

  },
};
