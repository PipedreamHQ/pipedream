import { USER_LIST_TYPE_OPTIONS } from "../../common/constants.mjs";
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
  version: "0.0.{{ts}}",
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
    listType: {
      type: "string",
      label: "Type",
      description: "The [type of customer list](https://developers.google.com/google-ads/api/rest/reference/rest/v16/UserList#CrmBasedUserListInfo) to create.",
      options: USER_LIST_TYPE_OPTIONS,
      reloadProps: true,
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
    const { results: { [0]: response } } = await this.googleAds.createUserList({
      $,
      accountId: this.accountId,
      customerId: this.customerClientId,
      data: {
        operations: [
          {
            create: {
              name: this.name,
              description: this.description,
              // crmBasedUserList: {
              //   uploadKeyType: "CONTACT_INFO",
              //   dataSourceType: "FIRST_PARTY",
              // },
              ...parseObject(this.additionalFields),
            },
          },
        ],
      },
    });

    const id = response.resourceName.split("/").pop();

    $.export("$summary", `Created customer list with ID ${id}`);
    return {
      id,
      ...response,
    };
  },
};
