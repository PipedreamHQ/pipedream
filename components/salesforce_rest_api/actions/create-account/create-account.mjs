import common from "../common/base.mjs";
import account from "../../common/sobjects/account.mjs";
import { toSingleLineString } from "../../common/utils.mjs";

const { salesforce } = common.props;

export default {
  ...common,
  key: "salesforce_rest_api-create-account",
  name: "Create Account",
  description: toSingleLineString(`
    Creates a Salesforce account, representing an individual account,
    which is an organization or person involved with your business (such as customers, competitors, and partners).
  `),
  version: "0.3.{{ts}}",
  type: "action",
  methods: {
    getAdvancedProps() {
      return account.extraProps;
    },
  },
  props: {
    salesforce,
    ...account.createProps,
    ...account.initialProps,
    docsInfo: {
      type: "alert",
      alertType: "info",
      content: "[See the documentation](https://developer.salesforce.com/docs/atlas.en-us.228.0.object_reference.meta/object_reference/sforce_api_objects_account.htm) for more information on Account fields.",
    },
    useAdvancedProps: {
      propDefinition: [
        salesforce,
        "useAdvancedProps",
      ],
    },
  },
  async run({ $ }) {
    const { // eslint-disable-next-line no-unused-vars
      salesforce, useAdvancedProps, docsInfo, ...data
    } = this;
    const response = await salesforce.createAccount({
      $,
      data,
    });
    $.export("$summary", `Successfully created account "${this.Name}"`);
    return response;
  },
};
