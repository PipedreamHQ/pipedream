import app from "../../apollo_io.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "apollo_io-update-contact",
  name: "Update Contact",
  description: "Updates an existing contact in Apollo.io. [See the documentation](https://apolloio.github.io/apollo-api-docs/?shell#update-a-contact)",
  type: "action",
  version: "0.0.9",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    contactId: {
      propDefinition: [
        app,
        "contactId",
      ],
    },
    email: {
      propDefinition: [
        app,
        "email",
      ],
      optional: true,
    },
    firstName: {
      propDefinition: [
        app,
        "firstName",
      ],
    },
    lastName: {
      propDefinition: [
        app,
        "lastName",
      ],
    },
    title: {
      propDefinition: [
        app,
        "title",
      ],
    },
    accountId: {
      propDefinition: [
        app,
        "accountId",
      ],
      optional: true,
    },
    websiteUrl: {
      propDefinition: [
        app,
        "websiteUrl",
      ],
    },
    labelNames: {
      propDefinition: [
        app,
        "labelNames",
      ],
    },
    address: {
      propDefinition: [
        app,
        "address",
      ],
    },
    phone: {
      propDefinition: [
        app,
        "phone",
      ],
    },
  },
  async run({ $ }) {
    const { contact } = await this.app.updateContact({
      $,
      contactId: this.contactId,
      data: utils.cleanObject({
        email: this.email,
        first_name: this.firstName,
        last_name: this.lastName,
        title: this.title,
        account_id: this.accountId,
        website_url: this.websiteUrl,
        label_names: typeof this.labelNames === "string"
          ? JSON.parse(this.labelNames)
          : this.labelNames,
        present_raw_address: this.address,
        direct_phone: this.phone,
      }),
    });

    $.export("$summary", `Successfully updated contact with ID ${contact.id}`);

    return contact;
  },
};
