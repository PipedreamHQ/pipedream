import utils from "../../common/utils.mjs";
import base from "../common/contact-base.mjs";

export default {
  key: "salesflare-create-contact",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  name: "Create Contact",
  description: "Create a contact [See the docs here](https://api.salesflare.com/docs#operation/postContacts)",
  props: {
    app: base.props.app,
    owner: {
      propDefinition: [
        base.props.app,
        "userId",
      ],
    },
    account: {
      propDefinition: [
        base.props.app,
        "accountIds",
      ],
      type: "integer",
      label: "Account",
      description: "Contact account. Any existing account will be removed from the contact when specifically passing `null`!",
    },
    ...base.props,
  },
  async run ({ $ }) {
    const pairs = {
      birthDate: "birth_date",
      phoneNumber: "phone_number",
      faxNumber: "fax_number",
      socialProfiles: "social_profiles",
      city: "address.city",
      country: "address.country",
      stateRegion: "address.state_region",
      street: "address.street",
      zip: "address.zip",
      organisation: "position.organisation",
      role: "position.role",
    };
    const data = utils.extractProps(this, pairs);
    const resp = await this.app.createContact({
      $,
      data,
    });
    $.export("$summary", `Contact (ID: ${resp.id}) has been created successfully.`);
    return resp;
  },
};
