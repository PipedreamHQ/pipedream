import utils from "../../common/utils.mjs";
import base from "../common/contact-base.mjs";

export default {
  key: "salesflare-update-contact",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  name: "Update Contact",
  description: "Updates a contact. [See the docs here](https://api.salesflare.com/docs#operation/putContactsContact_id)",
  props: {
    app: base.props.app,
    contactId: {
      propDefinition: [
        base.props.app,
        "contactId",
      ],
    },
    ...base.props,
    archived: {
      type: "boolean",
      label: "Archived",
      description: "Is contact archived",
      optional: true,
    },
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
    const resp = await this.app.updateContact({
      $,
      contactId: this.contactId,
      data,
    });
    $.export("$summary", "The contact has been updated successfully.");
    return resp;
  },
};
