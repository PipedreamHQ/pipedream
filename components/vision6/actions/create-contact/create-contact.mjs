import vision6 from "../../vision6.app.mjs";

export default {
  key: "vision6-create-contact",
  name: "Create Contact",
  description: "Create a new contact. [See the docs here](https://api.vision6.com/#create-a-single-contact)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
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
      description: "Add contact to the specified list",
    },
    email: {
      propDefinition: [
        vision6,
        "email",
      ],
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
    const data = {
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
    };
    const response = await this.vision6.createContact(this.list, {
      data,
      $,
    });
    $.export("$summary", `Successfully created contact with ID ${response.id}`);
    return response;
  },
};
