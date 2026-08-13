// x-pd-ai: optimized
import common, { getProps } from "../common/base-create-update.mjs";
import account from "../../common/sobjects/account.mjs";

export const docsLink = "https://developer.salesforce.com/docs/atlas.en-us.object_reference.meta/object_reference/sforce_api_objects_account.htm";

export default {
  ...common,
  key: "salesforce_rest_api-create-account",
  name: "Create Account",
  description: "Create a Salesforce account (a company or organization record)."
    + " Use **Describe Object** on `Account` to discover which fields your org requires before calling."
    + " For example, `Name` `Acme Corp` creates a minimal account and returns its new record ID."
    + " "
    + `[See the documentation](${docsLink})`,
  version: "0.3.7",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
