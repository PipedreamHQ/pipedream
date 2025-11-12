import drift from "../../drift.app.mjs";
import { removeNullEntries } from "../../common/utils.mjs";

export default {
  key: "drift-update-contact",
  name: "Update Contact",
  description: "Updates a contact in Drift using ID or email. Only changed attributes will be updated. [See Drift API documentation](https://devdocs.drift.com/docs/updating-a-contact)",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    drift,
    emailOrId: {
      type: "string",
      label: "Email or ID",
      description: "The contact’s email address or numeric ID.",
    },
    email: {
      type: "string",
      label: "Email",
      description: "The contact’s email address",
      optional: true,
    },
    name: {
      type: "string",
      label: "Name",
      description: "The contact’s name.",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "The contact’s phone number.",
      optional: true,
    },
    source: {
      type: "string",
      label: "Lead Source",
      description: "The value of the 'lead_create_source' custom attribute to match (case-sensitive).",
      optional: true,
    },
    customAttributes: {
      type: "object",
      label: "Custom Attributes",
      description: "Any custom attributes to update (e.g. company, job title, etc).",
      optional: true,
    },
  },

  async run({ $ }) {
    const {
      drift, name, email, phone, source, emailOrId,
    } = this;

    const customAttributes = drift.parseIfJSONString(this.customAttributes);

    const attributes = removeNullEntries({
      name,
      phone,
      email,
      source,
      ...customAttributes,
    });

    if (!Object.keys(attributes).length) {
      throw new Error("No attributes provided to update.");
    };

    let contact = await drift.getContactByEmailOrId($, emailOrId);

    const contactId = contact.data[0]?.id || contact.data.id;

    const response = await drift.updateContact({
      $,
      contactId,
      data: {
        attributes,
      },
    });

    $.export("$summary", `Contact ID "${contactId}" has been updated successfully.`);

    return response;
  },
};

