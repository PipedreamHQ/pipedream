import app from "../../apollo_io.app.mjs";

export default {
  key: "apollo_io-create-contact",
  name: "Create Contact",
  description: "Creates a new contact in Apollo.io. [See the documentation](https://apolloio.github.io/apollo-api-docs/?shell#create-a-contact)",
  type: "action",
  version: "0.0.9",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    email: {
      propDefinition: [
        app,
        "email",
      ],
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
    contactStageId: {
      propDefinition: [
        app,
        "contactStageId",
      ],
      optional: true,
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
    const { contact } = await this.app.createContact({
      $,
      data: {
        email: this.email,
        first_name: this.firstName,
        last_name: this.lastName,
        title: this.title,
        account_id: this.accountId,
        website_url: this.websiteUrl,
        label_names: this.labelNames,
        contact_stage_id: this.contactStageId,
        present_raw_address: this.address,
        direct_phone: this.phone,
      },
    });

    $.export("$summary", `Successfully created contact with ID ${contact.id}`);

    return contact;
  },
};
