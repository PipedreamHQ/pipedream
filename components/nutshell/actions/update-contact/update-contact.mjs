import { parseObject } from "../../common/utils.mjs";
import nutshell from "../../nutshell.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "nutshell-update-contact",
  name: "Update Contact",
  description: "Update an existing contact. Only provided fields are updated. Custom fields from your Nutshell pipeline can be set below or passed via the Custom Fields (Object) prop. [See the documentation](https://developers-rpc.nutshell.com/detail/class_core.html#a98db326321fb32ec79cff2112999dc1f)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    nutshell,
    contactId: {
      propDefinition: [
        nutshell,
        "contactId",
      ],
      label: "Contact ID",
      description: "The ID of the contact to update.",
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the contact.",
      optional: true,
    },
    phone: {
      propDefinition: [
        nutshell,
        "phone",
      ],
      description: "The phone numbers of the contact.",
      optional: true,
    },
    email: {
      propDefinition: [
        nutshell,
        "email",
      ],
      description: "The email address of the contact.",
      optional: true,
    },
    address: {
      propDefinition: [
        nutshell,
        "address",
      ],
      optional: true,
    },
    companyId: {
      propDefinition: [
        nutshell,
        "companyId",
      ],
      type: "string[]",
      description: "The company IDs for the contact.",
      optional: true,
    },
    leadId: {
      propDefinition: [
        nutshell,
        "leadId",
        ({ companyId }) => ({
          companyId,
        }),
      ],
      optional: true,
    },
    territoryId: {
      propDefinition: [
        nutshell,
        "territoryId",
      ],
      description: "The territory of the contact.",
      optional: true,
    },
    audienceId: {
      propDefinition: [
        nutshell,
        "audienceId",
      ],
      optional: true,
    },
    description: {
      propDefinition: [
        nutshell,
        "description",
      ],
      description: "A description for the contact.",
      optional: true,
    },
    customFields: {
      type: "object",
      label: "Custom Fields (Object)",
      description: "Optional object of custom field names to values, e.g. { \"Field Name\": \"value\" }. You can pass this from a previous step. Merged with any individual custom field inputs below.",
      optional: true,
    },
  },
  async additionalProps() {
    const { result: { Contacts: fields } } = await this.getCustomFields();
    const props = {};
    for (const field of fields ?? []) {
      const key = `customField_${field?.id}`;
      props[key] = {
        type: "string",
        label: field?.name,
        description: `Custom field ${field?.name}.`,
        optional: true,
      };
    }
    return props;
  },
  methods: {
    async getCustomFields() {
      return await this.nutshell.post({
        method: "findCustomFields",
      });
    },
    async parseCustomFields(props, customFieldsResult) {
      const customFields = {};
      const { result: { Contacts } } = customFieldsResult ?? await this.getCustomFields();
      for (const field of Contacts ?? []) {
        const key = `customField_${field?.id}`;
        if (Object.prototype.hasOwnProperty.call(props, key)) {
          customFields[field.name] = props[key];
        }
      }
      return customFields;
    },
  },
  async run({ $ }) {
    const existing = await this.nutshell.getContact({
      $,
      contactId: this.contactId,
    });
    if (!existing) {
      throw new ConfigurationError(`Contact not found: ${this.contactId}`);
    }
    const rev = existing.rev ?? null;

    const contact = {};
    if (this.name != null && this.name !== "") contact.name = this.name;
    if (this.description != null && this.description !== "") contact.description = this.description;
    if (this.phone != null) contact.phone = parseObject(this.phone);
    if (this.email != null) contact.email = parseObject(this.email);
    if (this.address != null) contact.address = parseObject(this.address);
    if (this.territoryId != null) contact.territoryId = this.territoryId;
    if (this.audienceId != null) {
      contact.audiences = this.audienceId.map((id) => ({
        id,
      }));
    }
    if (this.companyId != null && this.companyId.length) {
      contact.accounts = this.companyId.map((id) => ({
        id,
      }));
    }
    if (this.leadId != null && this.leadId.length) {
      contact.leads = this.leadId.map((id) => ({
        id,
      }));
    }
    const customFieldsData = await this.getCustomFields();
    const customFieldsFromProps = await this.parseCustomFields(this, customFieldsData);
    const customFieldsObject = this.customFields
      ? parseObject(this.customFields)
      : {};

    const hasCustomFields = Object.keys(customFieldsFromProps).length > 0
      || Object.keys(customFieldsObject).length > 0;
    if (hasCustomFields) {
      contact.customFields = {
        ...(existing.customFields ?? {}),
        ...customFieldsObject,
        ...customFieldsFromProps,
      };
    }

    if (Object.keys(contact).length === 0) {
      throw new ConfigurationError("Please provide at least one field to update.");
    }

    const updated = await this.nutshell.editContact({
      $,
      contactId: this.contactId,
      rev,
      contact,
    });

    let displayName = null;
    if (typeof updated.name === "object") {
      displayName = updated.name.displayName;
    } else if (typeof updated.name === "string") {
      displayName = updated.name;
    } else {
      displayName = this.contactId;
    }

    $.export("$summary", `Successfully updated contact "${displayName}"`);
    return this.nutshell.formatContact(updated);
  },
};
