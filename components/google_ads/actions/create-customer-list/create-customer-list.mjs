import {
  USER_LIST_TYPES, USER_LIST_TYPE_OPTIONS,
} from "./constants.mjs";
import { parseObject } from "../../common/utils.mjs";
import common from "../common/common.mjs";
import {
  getAdditionalFields, getListTypeInfo,
} from "./props.mjs";

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
  },
  additionalProps() {
    const { listType } = this;

    const docsLink = USER_LIST_TYPE_OPTIONS.find(({ value }) => value === listType)?.docsLink;

    const props = {
      listTypeInfo: getListTypeInfo(docsLink),
    };

    switch (listType) {
    case USER_LIST_TYPES.CRM_BASED:
      break;
    case USER_LIST_TYPES.RULE_BASED:
      break;
    case USER_LIST_TYPES.LOGICAL:
      break;
    case USER_LIST_TYPES.BASIC:
      break;
    case USER_LIST_TYPES.LOOKALIKE:
      break;
    }

    props.additionalFields = getAdditionalFields(docsLink);

    return props;
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
