import common, { getProps } from "../common/base.mjs";
import account from "../../common/sobjects/account.mjs";
import { docsLink } from "../create-account/create-account.mjs";
import propsAsyncOptions from "../../common/props-async-options.mjs";

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
  description: `Updates a Salesforce account. [See the documentation](${docsLink})`,
  version: "0.3.{{ts}}",
  type: "action",
  methods: {
    ...common.methods,
    getAdvancedProps() {
      return account.extraProps;
    },
  },
  props: {
    salesforce,
    accountId: {
      ...propsAsyncOptions.AccountId,
      async options() {
        return this.salesforce.listRecordOptions({
          objType: "Account",
        });
      },
    },
    ...props,
  },
  async run({ $ }) {
    /* eslint-disable no-unused-vars */
    const {
      salesforce,
      accountId,
      useAdvancedProps,
      docsInfo,
      additionalFields,
      ...data
    } = this;
    /* eslint-enable no-unused-vars */
    const response = await salesforce.updateAccount({
      $,
      id: accountId,
      data: {
        ...data,
        ...this.getAdditionalFields(),
      },
    });
    $.export(
      "$summary",
      `Successfully updated account (ID: ${this.accountId})`,
    );
    return response;
  },
};
