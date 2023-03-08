import app from "../../salesflare.app.mjs";
import utils from "../../common/utils.mjs";
import accountProps from "../common/account-props.mjs";

export default {
  key: "salesflare-create-account",
  version: "0.0.1",
  type: "action",
  name: "Create Account",
  description: "Create an account. [See the docs here](https://api.salesflare.com/docs#operation/postAccounts)",
  props: {
    app,
    owner: {
      propDefinition: [
        app,
        "userId",
      ],
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
    const resp = await this.app.createAccount({
      $,
      data,
    });
    $.export("$summary", `Account(ID:${resp.id}) has been created successfully.`);
    return resp;
  },
};
