import specific from "../../specific.app.mjs";

export default {
  key: "specific-update-create-contact",
  name: "Update or Create Contact",
  description: "Modify an existing contact's details or create a new one if the specified contact does not exist. [See the documentation](https://public-api.specific.app/docs/types/contact)",
  version: "0.0.1",
  type: "action",
  props: {
    specific,
    contactEmail: {
      propDefinition: [
        specific,
        "contactEmail",
      ],
      reloadProps: true,
    },
    companyId: {
      propDefinition: [
        specific,
        "companyId",
      ],
      optional: true,
    },
    name: {
      type: "string",
      label: "Name",
      description: "Contact's name.",
      optional: true,
    },
    email: {
      type: "string",
      label: "New Email",
      description: "New email to update",
      optional: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (this.content) {
      const { data: { customFields } } = await this.specific.query({
        model: "customFields",
        where: "{type: {equals: contact }}",
        fields: "name",
      });
      for (const { name } of customFields) {
        props[`customField-${name}`] = {
          type: "string",
          label: name,
          description: `Custom Field: ${name}`,
          optional: true,
        };
      }
    }
    return props;
  },
  async run({ $ }) {
    const {
      specific,
      ...data
    } = this;

    const customFields = this.specific.parseCustomFields(data);

    const response = await specific.mutation({
      $,
      model: "createOrUpdateContact",
      on: "CreatedOrUpdatedContacts",
      data: `{
        ${this.companyId
    ? `company: {
              connect: {
                id: "${this.companyId}"
              }
            }`
    : ""}
        ${customFields
    ? `customFields: ${customFields}`
    : ""}
        ${this.email
    ? `email: "${this.email}"`
    : ""}
        ${this.name
    ? `name: "${this.name}"`
    : ""}
      }`,
      where: `{email: "${this.contactEmail}"}`,
      fields: `
        contacts {
          id
          name
          email
          visitorId
          customFields
          company {
            contactsCount
            customFields
            id
            name
            visitorId
          } 
        }`,
    });

    if (response.errors) throw new Error(response.errors[0].message);

    $.export("$summary", `Successfully updated or created contact with email ${this.contactEmail}`);
    return response;
  },
};

