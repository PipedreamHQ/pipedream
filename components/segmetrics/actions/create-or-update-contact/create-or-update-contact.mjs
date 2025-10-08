import app from "../../segmetrics.app.mjs";

export default {
  name: "Create Or Update Contact",
  version: "0.0.5",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "segmetrics-create-or-update-contact",
  description: "Create or update a contact. [See documentation here](https://developers.segmetrics.io/#contacts)",
  type: "action",
  props: {
    app,
    integrationId: {
      label: "Integration ID",
      type: "string",
      description: "The ID of the Custom CRM integration from your Account Integrations page. Click to configure your Custom CRM integration, then copy the ID from the URL of the configuration page. For example, if the URL of the configuration page is `https://app.segmetrics.io/XXX/integration/configure/1234`, the integration ID is `1234`.",
    },
    email: {
      type: "string",
      label: "Contact's Email",
      description: "Email address of the contact",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "First name of the contact",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Last name of the contact",
    },
  },
  async run({ $ }) {
    const response = await this.app.createOrUpdateContact({
      $,
      integrationId: this.integrationId,
      data: {
        email: this.email,
        first_name: this.firstName,
        last_name: this.lastName,
      },
    });

    if (response) {
      $.export("$summary", `Successfully created or updated contact with email ${response.contact.email}`);
    }

    return response;
  },
};
