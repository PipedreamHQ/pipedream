import drift from "../../drift.app.mjs";
import { removeNullEntries } from "../../common/utils.mjs";

export default {
  key: "drift-create-contact",
  name: "Create Contact",
  description: "Creates a contact in Drift. [See the documentation](https://devdocs.drift.com/docs/creating-a-contact).",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    drift,
    email: {
      type: "string",
      label: "Email",
      description: "The contact's email address",
    },
    name: {
      type: "string",
      label: "Name",
      description: "The contact's full name",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "The contact's phone number",
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
      description: "Additional custom attributes to store on the contact",
      optional: true,
    },
  },

  async run({ $ }) {

    const {
      drift, email, name, phone, source,
    } = this;

    const customAttributes = drift.parseIfJSONString(this.customAttributes);

    const attributes = removeNullEntries({
      email,
      name,
      phone,
      source,
      ...customAttributes,
    });

    const existingContact = await drift.getContactByEmail({
      $,
      params: {
        email,
      },
    });

    if (existingContact && existingContact.data.length > 0) {
      throw new Error (`Contact ${email} already exists`);
    };

    const response = await drift.createContact({
      $,
      data: {
        attributes,
      },
    });

    $.export("$summary", `Contact "${email}" has been created successfully.`);
    return response;
  },
};

