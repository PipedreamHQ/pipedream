import {
  USER_LIST_TYPES, USER_LIST_TYPE_OPTIONS,
} from "./common-constants.mjs";
import {
  parseObject, parseStringObject,
} from "../../common/utils.mjs";
import common from "../common/common.mjs";
import {
  getAdditionalFields, getListTypeInfo,
} from "../common/props.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  ...common,
  key: "google_ads-create-customer-list",
  name: "Create Customer List",
  description: "Create a new customer list in Google Ads. [See the documentation](https://developers.google.com/google-ads/api/reference/rpc/v21/UserList)",
  version: "0.0.6",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
      description: "The [type of customer list](https://developers.google.com/google-ads/api/reference/rpc/v21/CrmBasedUserListInfo) to create.",
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

      case USER_LIST_TYPES.LOGICAL: {
        let { rules } = obj;
        if (rules) {
          rules = rules.map?.((rule) => parseStringObject(rule)) ?? parseStringObject(rules);
        }
        break;
      }

      case USER_LIST_TYPES.BASIC:
        if (obj?.conversionActions?.length || obj?.remarketingActions?.length) {
          obj.actions = [
            ...(obj.conversionActions ?? []).map((conversionAction) => ({
              conversionAction,
            })),
            ...(obj.remarketingActions ?? []).map((remarketingAction) => ({
              remarketingAction,
            })),
          ];
          delete obj.conversionActions;
          delete obj.remarketingActions;
        } else {
          throw new ConfigurationError("Select at least one Conversion or Remarketing action to build the list with");
        }
        break;

      case USER_LIST_TYPES.LOOKALIKE:
        break;
      }

      return obj;
    },
  },
  additionalProps() {
    const { listType } = this;

    if (!listType) {
      return {};
    }

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
