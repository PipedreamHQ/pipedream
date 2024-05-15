import {
  getAdditionalFieldsDescription, parseObject,
} from "../../common/utils.mjs";
import common from "../common/common.mjs";
const app = common.props.googleAds;

export default {
  ...common,
  key: "google_ads-create-customer-list",
  name: "Create Customer List",
  description: "Create a new customer list in Google Ads. [See the documentation](https://developers.google.com/google-ads/api/rest/reference/rest/v16/UserList)",
  version: "0.0.1",
  type: "action",
  props: {
    ...common.props,
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
      propDefinition: [
        app,
        "additionalFields",
      ],
      description:
      getAdditionalFieldsDescription("https://developers.google.com/google-ads/api/rest/reference/rest/v16/UserList"),
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
