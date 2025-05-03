import drift from "../../drift.app.mjs";
import { removeNullEntries } from "../../common/utils.mjs";

export default  {
  key: "drift-create-contact-test",
  name: "Create Contact",
  description: "Creates a contact in Drift. [See the docs](https://devdocs.drift.com/docs/creating-a-contact).",
  version: "0.0.4",
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
    customAttributes: {
      type: "object",
      label: "Custom Attributes",
      description: "Additional custom attributes to store on the contact",
      optional: true,
    },
  },

  async run({ $ }) {

    const warnings = [];

    const {
      drift, email, name, phone,
    } = this;

    warnings.push(...drift.checkIfEmailValid(email));

    const customAttributes = drift.parseIfJSONString(this.customAttributes);

    const attributes = removeNullEntries({
      email,
      name,
      phone,
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

    let response;

    try {
      response = await drift.createContact({
        $,
        data: {
          attributes,
        },
      });
    } catch (error) {
      drift.throwCustomError("Unable to create new contact", error, warnings);
    }

    $.export("$summary", `Contact "${email}" created with ID "${response.data.id}".`
        + "\n- "  + warnings.join("\n- "));
    return response;
  },
};

