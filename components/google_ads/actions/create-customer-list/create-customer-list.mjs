import { USER_LIST_TYPE_OPTIONS } from "./constants.mjs";
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
      label: "List Type",
      description: "The [type of customer list](https://developers.google.com/google-ads/api/rest/reference/rest/v16/UserList#CrmBasedUserListInfo) to create.",
      options: USER_LIST_TYPE_OPTIONS.map(({
        label, value,
      }) => ({
        label,
        value,
      })),
      reloadProps: true,
    },
  },
  additionalProps() {
    const { listType } = this;

    const option = USER_LIST_TYPE_OPTIONS.find(({ value }) => value === listType);
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
    const { // eslint-disable-next-line no-unused-vars
      googleAds, accountId, customerClientId, name, description, listType, additionalFields, ...data
    } = this;
    $;
    return {
      name: this.name,
      description: this.description,
      [this.listType]: data,
      ...parseObject(this.additionalFields),
    };
    // const { results: { [0]: response } } = await this.googleAds.createUserList({
    //   $,
    //   accountId,
    //   customerClientId,
    //   data: {
    //     operations: [
    //       {
    //         create: {
    //           name: this.name,
    //           description: this.description,
    //           [this.listType]: data,
    //           ...parseObject(this.additionalFields),
    //         },
    //       },
    //     ],
    //   },
    // });

    // const id = response.resourceName.split("/").pop();

    // $.export("$summary", `Created customer list with ID ${id}`);
    // return {
    //   id,
    //   ...response,
    // };
  },
};
