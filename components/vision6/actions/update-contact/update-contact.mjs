import vision6 from "../../vision6.app.mjs";
import pickBy from "lodash.pickby";

export default {
  key: "vision6-update-contact",
  name: "Update Contact",
  description: "Update an existing contact. [See the docs here](https://api.vision6.com/#update-contacts)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    vision6,
    list: {
      propDefinition: [
        vision6,
        "list",
      ],
    },
    contact: {
      propDefinition: [
        vision6,
        "contact",
        (c) => ({
          listId: c.list,
        }),
      ],
    },
    email: {
      propDefinition: [
        vision6,
        "email",
      ],
      optional: true,
    },
    mobile: {
      propDefinition: [
        vision6,
        "mobile",
      ],
    },
    emailSubscribed: {
      propDefinition: [
        vision6,
        "emailSubscribed",
      ],
    },
    mobileSubscribed: {
      propDefinition: [
        vision6,
        "mobileSubscribed",
      ],
    },
    isActive: {
      propDefinition: [
        vision6,
        "isActive",
      ],
    },
    doubleOptIn: {
      propDefinition: [
        vision6,
        "doubleOptIn",
      ],
    },
  },
  async run({ $ }) {
    const data = pickBy({
      contacts: [
        {
          id: this.contact,
          email: this.email,
          mobile: this.mobile,
          subscribed: this.emailSubscribed || this.mobileSubscribed
            ? {
              email: this.emailSubscribed,
              mobile: this.mobileSubscribed,
            }
            : undefined,
          is_active: this.isActive,
          double_opt_in: this.doubleOptIn,
        },
      ],
    });
    await this.vision6.updateContact(this.list, {
      data,
      $,
    });
    $.export("$summary", `Successfully updated contact with ID ${this.contact}`);
    // nothing to return
  },
};
