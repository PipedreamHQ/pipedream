import common, { getProps } from "../common/base-create-update.mjs";
import account from "../../common/sobjects/account.mjs";
import salesforce from "../../salesforce_rest_api.app.mjs";
import { docsLink } from "../create-account/create-account.mjs";

/* eslint-disable no-unused-vars */
const {
  salesforce: _sf, ...props
} = getProps({
  createOrUpdate: "update",
  objType: account,
  docsLink,
});
/* eslint-enable no-unused-vars */

export default {
  ...common,
  key: "salesforce_rest_api-update-account",
  name: "Update Account",
  description: "Update fields on an existing Salesforce account."
    + " Only the fields you supply change; everything else is left as-is."
    + " Use **Find Records** on `Account` to get the record ID first."
    + " "
    + `[See the documentation](${docsLink})`,
  version: "0.4.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  ai: "optimized",
  methods: {
    ...common.methods,
  },
  props: {
    salesforce,
    accountId: {
      type: "string",
      label: "Account ID",
      description: "The ID of the Account to update (Salesforce's 15- or 18-character record ID, e.g. `001XX000003DHP0`). Use **SOQL Query** to find the ID.",
    },
    ...props,
  },
  async run({ $ }) {
    /* eslint-disable no-unused-vars */
    const {
      salesforce,
      getAdditionalFields,
      formatDateTimeProps,
      accountId,
      docsInfo,
      additionalFields,
      ...data
    } = this;
    /* eslint-enable no-unused-vars */
    const response = await salesforce.updateRecord("Account", {
      $,
      id: accountId,
      data: {
        ...data,
        ...getAdditionalFields(),
      },
    });
    $.export(
      "$summary",
      `Successfully updated account (ID: ${this.accountId})`,
    );
    return response;
  },
};
