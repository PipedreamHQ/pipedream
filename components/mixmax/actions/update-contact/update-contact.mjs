import common from "../common/base.mjs";

export default {
  ...common,
  key: "mixmax-update-contact",
  name: "Update Contact",
  description: "Update a specific contact. [See the docs here](https://developer.mixmax.com/reference/contactsid-1)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
    id: {
      propDefinition: [
        common.props.mixmax,
        "contactId",
      ],
      type: "string",
      description: "Email address for the contact. This is unique per contact. If you create a new contact with the same email as an existing contact, then this will be merged with that contact.",
    },
    email: {
      propDefinition: [
        common.props.mixmax,
        "email",
      ],
      type: "string",
      description: "Email address for the contact. This is unique per contact. If you create a new contact with the same email as an existing contact, then this will be merged with that contact.",
      optional: true,
    },
    name: {
      propDefinition: [
        common.props.mixmax,
        "name",
      ],
      description: "Name for the contact.",
      optional: true,
    },
    contactId: {
      type: "string",
      label: "Contact Id",
      description: "Google ID that this contact is associated with, if a contact exists in Google Contacts for this same email address.",
      optional: true,
    },
    salesforceId: {
      propDefinition: [
        common.props.mixmax,
        "salesforceId",
      ],
      optional: true,
    },
    meta: {
      propDefinition: [
        common.props.mixmax,
        "meta",
      ],
      optional: true,
    },
  },
  methods: {
    async processEvent() {
      const {
        id,
        email,
        name,
        contactId,
        salesforceId,
        meta,
      } = this;

      return this.mixmax.updateContact({
        id,
        data: {
          email,
          name,
          meta,
          contactId,
          salesforceId,
        },
      });
    },
    getSummary() {
      return "Contact Successfully updated!";
    },
  },
};
