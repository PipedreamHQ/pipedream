// x-pd-ai: optimized
import common, { getProps } from "../common/base-create-update.mjs";
import account from "../../common/sobjects/account.mjs";
import { docsLink } from "../create-account/create-account.mjs";

const {
  salesforce, ...props
} = getProps({
  createOrUpdate: "update",
  objType: account,
  docsLink,
});

export default {
  ...common,
  key: "salesforce_rest_api-update-account",
  name: "Update Account",
  description: "Update fields on an existing Salesforce account."
    + " Only the fields you supply change; everything else is left as-is."
    + " Use **Find Records** on `Account` to get the record ID first."
    + " "
    + `[See the documentation](${docsLink})`,
  version: "0.3.7",
  annotations: {
    destructiveHint: true,
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
  props: {
    salesforce,
    accountId: {
      propDefinition: [
        salesforce,
        "recordId",
        () => ({
          objType: "Account",
          nameField: "Name",
        }),
      ],
      label: "Account ID",
      description: "The Account to update.",
    },
    ...props,
  },
  async run({ $ }) {
    /* eslint-disable no-unused-vars */
    const {
      salesforce,
      getAdvancedProps,
      getObjectType,
      getAdditionalFields,
      formatDateTimeProps,
      accountId,
      useAdvancedProps,
      docsInfo,
      dateInfo,
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
