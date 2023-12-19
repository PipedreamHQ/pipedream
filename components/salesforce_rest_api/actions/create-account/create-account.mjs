import common from "../common/base.mjs";
import account from "../../common/sobjects/account.mjs";
import {
  pickBy, pick,
} from "lodash-es";
import { toSingleLineString } from "../../common/utils.mjs";

const { salesforce } = common.props;

export default {
  ...common,
  key: "salesforce_rest_api-create-account",
  name: "Create Account",
  description: toSingleLineString(`
    Creates a Salesforce account, representing an individual account,
    which is an organization or person involved with your business (such as customers, competitors, and partners).
    See [Account SObject](https://developer.salesforce.com/docs/atlas.en-us.228.0.object_reference.meta/object_reference/sforce_api_objects_account.htm)
    and [Create Record](https://developer.salesforce.com/docs/atlas.en-us.228.0.api_rest.meta/api_rest/dome_sobject_create.htm)
  `),
  version: "0.2.5",
  type: "action",
  props: {
    salesforce,
    Name: {
      type: "string",
      label: "Name",
      description: "Name of the account.",
    },
    selector: {
      propDefinition: [
        salesforce,
        "fieldSelector",
      ],
      description: `${salesforce.propDefinitions.fieldSelector.description} Account`,
      options: () => Object.keys(account),
      reloadProps: true,
    },
  },
  additionalProps() {
    return this.additionalProps(this.selector, account);
  },
  async run({ $ }) {
    const data = pickBy(pick(this, [
      "Name",
      ...this.selector,
    ]));
    const response = await this.salesforce.createAccount({
      $,
      data,
    });
    $.export("$summary", `Successfully created account "${this.Name}"`);
    return response;
  },
};
