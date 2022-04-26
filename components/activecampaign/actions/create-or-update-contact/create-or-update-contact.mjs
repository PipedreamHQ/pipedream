// legacy_hash_id: a_poiz1V
import { axios } from "@pipedream/platform";

export default {
  key: "activecampaign-create-or-update-contact",
  name: "Create or Update Contact",
  description: "Creates a new contact or updates an existing contact.",
  version: "0.2.2",
  type: "action",
  props: {
    activecampaign: {
      type: "app",
      app: "activecampaign",
    },
    email: {
      type: "string",
      description: "Email address of the contact. Example: 'test@example.com'.",
    },
    firstName: {
      type: "string",
      description: "First name of the contact.",
      optional: true,
    },
    lastName: {
      type: "string",
      description: "Last name of the contact.",
      optional: true,
    },
    phone: {
      type: "integer",
      description: "Phone number of the contact.",
      optional: true,
    },
    fieldValues: {
      type: "any",
      description: "Contact's custom field values [{field, value}]",
      optional: true,
    },
    orgid: {
      type: "integer",
      description: "(Deprecated) Please use Account-Contact end points.",
      optional: true,
    },
    deleted: {
      type: "boolean",
      description: "(Deprecated) Please use the DELETE endpoint.",
      optional: true,
    },
  },
  async run({ $ }) {
  // See the API docs: https://developers.activecampaign.com/reference#create-or-update-contact-new

    if (!this.email) {
      throw new Error("Must provide email parameter.");
    }

    const config = {
      method: "post",
      url: `${this.activecampaign.$auth.base_url}/api/3/contact/sync`,
      headers: {
        "Api-Token": `${this.activecampaign.$auth.api_key}`,
      },
      data: {
        contact: {
          email: this.email,
          firstName: this.firstName,
          lastName: this.lastName,
          phone: parseInt(this.phone),
          fieldValues: this.fieldValues,
          orgid: parseInt(this.orgid),
          deleted: this.deleted,
        },
      },
    };
    return await axios($, config);
  },
};
