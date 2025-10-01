import flexmail from "../../flexmail.app.mjs";

export default {
  key: "flexmail-create-update-contact",
  name: "Create or Update Contact",
  description: "Creates or updates a contact based on email address within Flexmail. [See the documentation](https://api.flexmail.eu/documentation/#post-/contacts)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    flexmail,
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the contact",
      reloadProps: true,
    },
    language: {
      propDefinition: [
        flexmail,
        "language",
      ],
    },
    source: {
      propDefinition: [
        flexmail,
        "source",
      ],
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The first name of the contact",
      optional: true,
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the contact",
      optional: true,
    },
  },
  async additionalProps() {
    const props = {};
    const { _embedded: embedded } = await this.flexmail.listCustomFields();
    if (!embedded || !embedded.item?.length) {
      return props;
    }
    for (const field of embedded.item) {
      props[field.placeholder] = {
        type: field.type === "numeric"
          ? "integer"
          : "string",
        label: field.name,
        optional: true,
      };
      if (field.type === "date") {
        props[field.placeholder].description = "Enter date in `YYYY-MM-DD` format";
      }
    }
    return props;
  },
  async run({ $ }) {
    const {
      flexmail,
      email,
      language,
      source,
      firstName,
      name,
      ...customFields
    } = this;

    const data = {
      language,
      first_name: firstName,
      name,
      custom_fields: customFields,
    };

    const { _embedded: contact } = await this.flexmail.listContacts({
      params: {
        email,
      },
      $,
    });

    if (!contact || !contact.item?.length) {
      const response = await flexmail.createContact({
        data: {
          ...data,
          email,
          source,
        },
        $,
      });
      $.export("$summary", `Successfully created contact with id ${response.id}.`);
      return response;
    }

    const contactId = contact.item[0].id;
    await flexmail.updateContact({
      contactId,
      data,
      $,
    });

    $.export("$summary", `Successfully updated contact with id ${contactId}.`);
    // nothing to return on update
  },
};
