import app from "../../apollo_io.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "apollo_io-create-update-contact",
  name: "Create Or Update Contact",
  description: "Creates or updates a specific contact. If the contact email already exists, it's updated. Otherwise, a new contact is created. [See the documentation](https://apolloio.github.io/apollo-api-docs/?shell#create-a-contact)",
  type: "action",
  version: "0.0.6",
  annotations: {
    destructiveHint: true,
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
  async run({ $: step }) {
    let contact = {};
    let action = "created";
    let data = utils.cleanObject({
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
    });

    const { contacts } = await this.app.searchContacts({
      params: {
        q_keywords: this.email,
      },
    });

    if (contacts.length) {
      action = "updated";
      contact = contacts[0];

      await this.app.updateContact({
        step,
        contactId: contact.id,
        data: {
          ...contact,
          ...data,
        },
      });
    } else {
      const response = await this.app.createContact({
        step,
        data,
      });
      contact = response.contact;
    }

    step.export("$summary", `Successfully ${action} contact with ID ${contact.id}`);

    return contact;
  },
};
