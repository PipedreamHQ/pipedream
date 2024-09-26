import common, { getProps } from "../common/base-create-update.mjs";
import account from "../../common/sobjects/account.mjs";

export const docsLink = "https://developer.salesforce.com/docs/atlas.en-us.object_reference.meta/object_reference/sforce_api_objects_account.htm";

export default {
  ...common,
  key: "salesforce_rest_api-create-account",
  name: "Create Account",
  description: `Creates a Salesforce account. [See the documentation](${docsLink})`,
  version: "0.3.0",
  type: "action",
  methods: {
    ...common.methods,
    getObjectType() {
      return "Account";
    },
    getAdvancedProps() {
      return account.extraProps;
    },
  },
  props: getProps({
    objType: account,
    docsLink,
  }),
  async run({ $ }) {
    /* eslint-disable no-unused-vars */
    const {
      salesforce,
      getAdvancedProps,
      getObjectType,
      getAdditionalFields,
      formatDateTimeProps,
      useAdvancedProps,
      docsInfo,
      dateInfo,
      additionalFields,
      ...data
    } = this;
    /* eslint-enable no-unused-vars */
    const response = await salesforce.createRecord("Account", {
      $,
      data: {
        ...data,
        ...getAdditionalFields(),
      },
    });
    $.export("$summary", `Successfully created account "${this.Name}"`);
    return response;
  },
};
