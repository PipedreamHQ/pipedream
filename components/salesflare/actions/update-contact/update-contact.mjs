import app from "../../salesflare.app.mjs";
import utils from "../../common/utils.mjs";
import contactProps from "../common/contact-props.mjs";

export default {
  key: "salesflare-update-contact",
  version: "0.0.1",
  type: "action",
  name: "Update Contact",
  description: "Updates a contact. [See the docs here](https://api.salesflare.com/docs#operation/putContactsContact_id)",
  props: {
    app,
    contactId: {
      propDefinition: [
        app,
        "contactId",
      ],
    },
    ...contactProps,
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
