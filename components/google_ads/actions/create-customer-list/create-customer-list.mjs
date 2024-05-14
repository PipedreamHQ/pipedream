import { parseObject } from "../../common/utils.mjs";
import googleAds from "../../google_ads.app.mjs";

export default {
  key: "google_ads-create-customer-list",
  name: "Create Customer List",
  description: "Create a new customer list in Google Ads. [See the documentation](https://developers.google.com/google-ads/api/rest/reference/rest/v16/UserList)",
  version: "0.0.1",
  type: "action",
  props: {
    googleAds,
    accountId: {
      propDefinition: [
        googleAds,
        "accountId",
      ],
    },
    customerClientId: {
      propDefinition: [
        googleAds,
        "customerClientId",
        ({ accountId }) => ({
          accountId,
        }),
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the customer list.",
    },
    description: {
      type: "string",
      label: "Description",
      description: "Description of the customer list.",
      optional: true,
    },
    additionalFields: {
      type: "object",
      label: "Additional Fields",
      description:
        "Additional fields and values for the customer list. [See the documentation](https://developers.google.com/google-ads/api/rest/reference/rest/v16/UserList) for available fields. Values will be parsed as JSON where applicable.",
      optional: true,
    },
  },
  async run({ $ }) {
    // const updateMask = [
    //   "name",
    //   "description",
    //   ...Object.keys(this.additionalFields ?? {}),
    // ].filter((key) => this[key] !== undefined);
    const response = await this.googleAds.createUserList({
      $,
      accountId: this.accountId,
      customerId: this.customerClientId,
      data: {
        operations: [
          {
            // updateMask,
            create: {
              name: this.name,
              description: this.description,
              ...parseObject(this.additionalFields),
            },
          },
        ],
      },
    });

    $.export("$summary", `Created customer list with ID ${response.id}`);
    return response;
  },
};
