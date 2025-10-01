import app from "../../zoho_campaigns.app.mjs";

export default {
  type: "action",
  key: "zoho_campaigns-add-contact-to-mailing-list",
  name: "Add Contact to Mailing List",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "You can use this API to add contacts to your mailing lists. [See the documentation](https://www.zoho.com/campaigns/help/developers/contact-subscribe.html)",
  props: {
    app,
    listkey: {
      propDefinition: [
        app,
        "mailingList",
      ],
      label: "Mailing List",
      description: "List Key to send a subscription mail to contacts of the list.",
    },
    contactEmail: {
      type: "string",
      label: "Contact Email",
      description: "Contact email can be added.",
    },
    contactFirstName: {
      type: "string",
      label: "Contact First Name",
      description: "Contact first name can be added.",
      optional: true,
    },
    contactLastName: {
      type: "string",
      label: "Contact Last Name",
      description: "Contact last name can be added.",
      optional: true,
    },
    source: {
      type: "string",
      label: "Source",
      description: "Contact source can be added.",
      optional: true,
    },
    topic_id: {
      propDefinition: [
        app,
        "topic",
      ],
      optional: true,
    },
    contactAdditionalFields: {
      type: "object",
      label: "Contact Additional Fields",
      description: "Any desired additional fields.",
      optional: true,
    },
  },
  methods: {
    getContactInfo(contactEmail, contactFirstName, contactLastName) {
      const contactInfo = {
        "Contact Email": contactEmail,
        ...this.contactAdditionalFields,
      };

      if (contactFirstName) {
        contactInfo["First Name"] = contactFirstName;
      }

      if (contactLastName) {
        contactInfo["Last Name"] = contactLastName;
      }

      return JSON.stringify(contactInfo);
    },
  },
  async run({ $ }) {
    const {
      app,
      contactEmail,
      contactFirstName,
      contactLastName,
      ...data
    } = this;

    const res = await app.addSubscriberToList({
      ...data,
      contactinfo: this.getContactInfo(contactEmail, contactFirstName, contactLastName),
    });
    if (res.status !== "success") {
      throw new Error(`${res.message} - ${JSON.stringify(res)}`);
    }
    $.export("summary", `Contact "${contactEmail}" added to mailing list successfully`);
    return res;
  },
};
