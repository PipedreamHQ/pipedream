import app from "../../salesforge.app.mjs";

export default {
  key: "salesforge-create-contact",
  name: "Create Contact",
  description: "Create a new contact in Salesforge. [See the documentation](https://api.salesforge.ai/public/v2/swagger/index.html)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    workspaceId: {
      propDefinition: [
        app,
        "workspaceId",
      ],
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the contact",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The first name of the contact",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The last name of the contact",
    },
    company: {
      type: "string",
      label: "Company",
      description: "The company name of the contact",
      optional: true,
    },
    linkedinUrl: {
      type: "string",
      label: "LinkedIn URL",
      description: "The LinkedIn profile URL of the contact",
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "One or more tags to assign to the contact",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      app, workspaceId, ...data
    } = this;

    const response = await app.createContact({
      $,
      workspaceId,
      data,
    });

    $.export("$summary", `Successfully created contact (ID: ${response.id})`);
    return response;
  },
};
