import common, { getProps } from "../common/base.mjs";
import account from "../../common/sobjects/account.mjs";

export const docsLink = "https://developer.salesforce.com/docs/atlas.en-us.object_reference.meta/object_reference/sforce_api_objects_account.htm";

export default {
  ...common,
  key: "salesforce_rest_api-create-account",
  name: "Create Account",
  description: `Creates a Salesforce account. [See the documentation](${docsLink})`,
  version: "0.3.{{ts}}",
  type: "action",
  methods: {
    ...common.methods,
    getAdvancedProps() {
      return account.extraProps;
    },
  },
  props: getProps({
    objType: account,
    docsLink,
  }),
  async run({ $ }) {
    const { // eslint-disable-next-line no-unused-vars
      salesforce, useAdvancedProps, docsInfo, dateInfo, additionalFields, ...data
    } = this;
    const response = await salesforce.createAccount({
      $,
      data: {
        ...data,
        ...this.getAdditionalFields(),
      },
    });
    $.export("$summary", `Successfully created account "${this.Name}"`);
    return response;
  },
};
