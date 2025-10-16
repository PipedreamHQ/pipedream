import common from "../common/base.mjs";

export default {
  ...common,
  key: "mixmax-create-contact",
  name: "Create Contact",
  description: "Create one contact. [See the docs here](https://developer.mixmax.com/reference/contacts-1)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
    email: {
      propDefinition: [
        common.props.mixmax,
        "email",
      ],
      type: "string",
      description: "Email address for the contact. This is unique per contact. If you create a new contact with the same email as an existing contact, then this will be merged with that contact.",
    },
    name: {
      propDefinition: [
        common.props.mixmax,
        "name",
      ],
      description: "Name for the contact.",
      optional: true,
    },
    groups: {
      propDefinition: [
        common.props.mixmax,
        "groups",
      ],
      description: "Array of groups that this contact is in.",
      optional: true,
    },
    meta: {
      propDefinition: [
        common.props.mixmax,
        "meta",
      ],
      optional: true,
    },
    contactId: {
      type: "string",
      label: "ContactId",
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
    markAsUsed: {
      type: "boolean",
      label: "Mark As Used",
      description: "Meta-field that will increment the contact's usedCount count and also set the `timestamp` to now.",
      optional: true,
    },
    enrich: {
      type: "boolean",
      label: "Enrich",
      description: "Meta-field that if true, will merge in information from third party sources such as Salesforce, if there's a Salesforce account connected and the email address of this contact matches.",
      optional: true,
    },
  },
  methods: {
    async processEvent() {
      const {
        email,
        name,
        groups,
        meta,
        contactId,
        salesforceId,
        markAsUsed,
        enrich,
      } = this;

      return this.mixmax.createContact({
        data: {
          email,
          name,
          groups,
          meta,
          contactId,
          salesforceId,
          markAsUsed,
          enrich,
        },
      });
    },
    getSummary() {
      return "Contact Successfully created!";
    },
  },
};
