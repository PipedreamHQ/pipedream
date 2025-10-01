import mailercloud from "../../mailercloud.app.mjs";

export default {
  key: "mailercloud-add-contact-list",
  name: "Add Contact to List",
  description: "Adds a new contact to a selected list in the user's Mailercloud account. [See the documentation](https://apidoc.mailercloud.com/docs/mailercloud-api/7f625be9563b2-create-contact)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    mailercloud,
    listId: {
      propDefinition: [
        mailercloud,
        "listId",
      ],
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email for the contact",
    },
    name: {
      propDefinition: [
        mailercloud,
        "name",
      ],
    },
    city: {
      propDefinition: [
        mailercloud,
        "city",
      ],
    },
    state: {
      propDefinition: [
        mailercloud,
        "state",
      ],
    },
    zip: {
      propDefinition: [
        mailercloud,
        "zip",
      ],
    },
    country: {
      propDefinition: [
        mailercloud,
        "country",
      ],
    },
    phone: {
      propDefinition: [
        mailercloud,
        "phone",
      ],
    },
    industry: {
      propDefinition: [
        mailercloud,
        "industry",
      ],
    },
    department: {
      propDefinition: [
        mailercloud,
        "department",
      ],
    },
    jobTitle: {
      propDefinition: [
        mailercloud,
        "jobTitle",
      ],
    },
    organization: {
      propDefinition: [
        mailercloud,
        "organization",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.mailercloud.createContact({
      data: {
        list_id: this.listId,
        email: this.email,
        name: this.name,
        city: this.city,
        state: this.state,
        zip: this.zip,
        country: this.country,
        phone: this.phone,
        industry: this.industry,
        department: this.department,
        job_title: this.jobTitle,
        organization: this.organization,
      },
      $,
    });
    $.export("$summary", `Successfully added contact to list ${this.listId}`);
    return response;
  },
};
