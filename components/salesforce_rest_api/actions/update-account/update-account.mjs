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
  description: `Updates a Salesforce account. [See the documentation](${docsLink})`,
  version: "0.3.7",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  methods: {
    ...common.methods,
  },
  props: {
    salesforce,
    accountId: {
      type: "string",
      label: "Account ID",
      description: "The ID of the Account to update. Use **SOQL Query** to find the ID.",
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
