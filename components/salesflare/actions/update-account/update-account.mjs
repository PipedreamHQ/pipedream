import utils from "../../common/utils.mjs";
import base from "../common/account-base.mjs";

export default {
  key: "salesflare-update-account",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  name: "Update Account",
  description: "Update an account [See the docs here](https://api.salesflare.com/docs#operation/putAccountsAccount_id)",
  props: {
    app: base.props.app,
    accountId: {
      propDefinition: [
        base.props.app,
        "accountIds",
      ],
      label: "Account ID",
      type: "integer",
      description: "Account ID",
    },
    ...base.props,
  },
  async run ({ $ }) {
    const pairs = {
      phoneNumber: "phone_number",
      socialProfiles: "social_profiles",
      city: "address.city",
      country: "address.country",
      stateRegion: "address.state_region",
      street: "address.street",
      zip: "address.zip",
    };
    const data = utils.extractProps(this, pairs);
    delete data.accountId;
    const resp = await this.app.updateAccount({
      $,
      accountId: this.accountId,
      data,
    });
    $.export("$summary", "The account has been updated successfully.");
    return resp;
  },
};
