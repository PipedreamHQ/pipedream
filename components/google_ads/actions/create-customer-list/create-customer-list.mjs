import {
  USER_LIST_TYPES, USER_LIST_TYPE_OPTIONS,
} from "./constants.mjs";
import { parseObject } from "../../common/utils.mjs";
import common from "../common/common.mjs";
import {
  getAdditionalFields, getListTypeInfo,
} from "./props.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  ...common,
  key: "google_ads-create-customer-list",
  name: "Create Customer List",
  description:
    "Create a new customer list in Google Ads. [See the documentation](https://developers.google.com/google-ads/api/rest/reference/rest/v16/UserList)",
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
      label: "List Type",
      description:
        "The [type of customer list](https://developers.google.com/google-ads/api/rest/reference/rest/v16/UserList#CrmBasedUserListInfo) to create.",
      options: USER_LIST_TYPE_OPTIONS.map(({
        label, value,
      }) => ({
        label,
        value,
      })),
      reloadProps: true,
    },
  },
  methods: {
    parseFields(obj) {
      switch (this.listType) {
      case USER_LIST_TYPES.CRM_BASED:
        break;

      case USER_LIST_TYPES.RULE_BASED:
        if (obj.prepopulationStatus) {
          obj.prepopulationStatus = "REQUESTED";
        }
        if (obj.flexibleRuleUserList) {
          obj.flexibleRuleUserList = parseObject(obj.flexibleRuleUserList);
        }
        break;

      case USER_LIST_TYPES.LOGICAL:
        if (obj.rules) {
          obj.rules = obj.rules.map((rule) => parseObject(rule));
        }
        break;

      case USER_LIST_TYPES.BASIC:
        break;
      case USER_LIST_TYPES.LOOKALIKE:
        break;
      }

      return obj;
    },
  },
  additionalProps() {
    const { listType } = this;

    const option = USER_LIST_TYPE_OPTIONS.find(
      ({ value }) => value === listType,
    );
    if (!option) {
      throw new ConfigurationError("Select a valid List Type to proceed.");
    }

    const {
      docsLink, props,
    } = option;

    const newProps = {
      listTypeInfo: getListTypeInfo(docsLink),
    };

    Object.assign(newProps, props);

    newProps.additionalFields = getAdditionalFields(docsLink);

    return newProps;
  },
  async run({ $ }) {
    const {
      googleAds,
      accountId,
      customerClientId,
      name,
      description,
      listType,
      additionalFields,
      ...data
    } = this;
    const { results: { [0]: response } } = await googleAds.createUserList({
      $,
      accountId,
      customerClientId,
      data: {
        operations: [
          {
            create: {
              name,
              description,
              [listType]: this.parseFields(data),
              ...parseObject(additionalFields),
            },
          },
        ],
      },
    });

    const id = response.resourceName.split("/").pop();

    $.export(
      "$summary",
      `Created customer list of type \`${listType}\` with ID \`${id}\``,
    );
    return {
      id,
      ...response,
    };
  },
};
