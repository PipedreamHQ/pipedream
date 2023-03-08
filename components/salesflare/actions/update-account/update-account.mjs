import app from "../../salesflare.app.mjs";
import utils from "../../common/utils.mjs";
import accountProps from "../common/account-props.mjs";

export default {
  key: "salesflare-update-account",
  version: "0.0.1",
  type: "action",
  name: "Update Account",
  description: "Update an account [See the docs here](https://api.salesflare.com/docs#operation/putAccountsAccount_id)",
  props: {
    app,
    accountId: {
      propDefinition: [
        app,
        "accountIds",
      ],
      label: "Account ID",
      type: "integer",
      description: "Account ID",
    },
    ...accountProps,
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
