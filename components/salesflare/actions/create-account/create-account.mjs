import utils from "../../common/utils.mjs";
import base from "../common/account-base.mjs";

export default {
  key: "salesflare-create-account",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  name: "Create Account",
  description: "Create an account. [See the docs here](https://api.salesflare.com/docs#operation/postAccounts)",
  props: {
    app: base.props.app,
    owner: {
      propDefinition: [
        base.props.app,
        "userId",
      ],
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
    const resp = await this.app.createAccount({
      $,
      data,
    });
    $.export("$summary", `Account (ID: ${resp.id}) has been created successfully.`);
    return resp;
  },
};
