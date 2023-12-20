import common from "../common/base.mjs";
import account from "../../common/sobjects/account.mjs";
import {
  pickBy, pick,
} from "lodash-es";
import { toSingleLineString } from "../../common/utils.mjs";

const { salesforce } = common.props;

export default {
  ...common,
  key: "salesforce_rest_api-update-account",
  name: "Update Account",
  description: toSingleLineString(`
    Updates a Salesforce account, representing an individual account,
    which is an organization or person involved with your business (such as customers, competitors, and partners).
    See [Account SObject](https://developer.salesforce.com/docs/atlas.en-us.228.0.object_reference.meta/object_reference/sforce_api_objects_account.htm)
    and [Update Record](https://developer.salesforce.com/docs/atlas.en-us.228.0.api_rest.meta/api_rest/dome_update_fields.htm)
  `),
  version: "0.2.5",
  type: "action",
  props: {
    salesforce,
    AccountId: {
      type: "string",
      label: "Account ID",
      description: "ID of the Account to modify.",
    },
    Name: {
      type: "string",
      label: "Name",
      description: "Name of the account. Maximum size is 255 characters. If the account has a record type of Person Account:\nThis value is the concatenation of the FirstName, MiddleName, LastName, and Suffix of the associated person contact.",
      optional: true,
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
      "AccountId",
      "Name",
      ...this.selector,
    ]));
    const response = await this.salesforce.updateAccount({
      $,
      id: this.AccountId,
      data,
    });
    $.export("$summary", `Successfully updated account ${this.AccountId}`);
    return response;
  },
};
