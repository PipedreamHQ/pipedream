import drift from "../../drift.app.mjs";

export default {
  key: "drift-update-contact",
  name: "Update Contact",
  description: "Updates a contact in Drift using ID or email. Only changed attributes will be updated. [See Drift API docs](https://devdocs.drift.com/docs/updating-a-contact)",
  version: "0.0.2",
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
      label: "New Email",
      description: "The new email address to assign to this contact.",
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
    customAttributes: {
      type: "object",
      label: "Custom Attributes",
      description: "Any custom attributes to update (e.g. company, job title, etc).",
      optional: true,
    },
  },

  async run({ $ }) {
    const warnings = [];
    const { drift } = this;
    const emailOrId = drift.trimIfString(this.emailOrId);
    warnings.push(...drift.checkEmailOrId(emailOrId));

    let contactId;

    // Resolve contact by ID or email
    if (drift.isIdNumber(Number(emailOrId))) {
      contactId = Number(emailOrId);
      try {
        await drift.getContactById({
          $,
          contactId,
        }); // validate
      } catch (error) {
        if (error.status === 404) {
          throw new Error(`No contact found with ID: ${contactId}`);
        } else {
          throw error;
        }
      }
    } else {
      const response = await drift.getContactByEmail({
        $,
        params: {
          email: emailOrId,
        },
      });
      if (!response?.data?.length) {
        throw new Error(`No contact found with email: ${emailOrId}` +
          "\n- " + warnings.join("\n- "));
      }
      contactId = response.data[0].id;
    }

    // Safely merge attributes
    const attributes = {
      ...(this.email && {
        email: this.email,
      }),
      ...(this.name && {
        name: this.name,
      }),
      ...(this.phone && {
        phone: this.phone,
      }),
      ...this.customAttributes,
    };

    // Remove conflicts where top-level fields exist in customAttributes
    [
      "email",
      "name",
      "phone",
    ].forEach((key) => {
      if (this.customAttributes?.[key]) {
        warnings.push(`Warning: Custom attribute "${key}" is ignored because it’s already handled as a top-level prop.`);
        delete attributes[key];
      }
    });

    if (!Object.keys(attributes).length) {
      throw new Error("No attributes provided to update.");
    }

    const response = await drift.updateContactById(contactId, {
      $,
      attributes,
    });

    $.export("$summary", `Contact ID ${contactId} updated successfully.`);
    return response;
  },
};
