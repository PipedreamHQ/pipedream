import app from "../../airslate.app.mjs";

export default {
  key: "airslate-create-new-organization",
  name: "Create New Organization",
  description: "Creates a new organization in airslate with optional settings. [See the documentation](https://docs.airslate.io/docs/airslate-api/organizations-api%2Foperations%2Fcreate-a-organization)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    name: {
      propDefinition: [
        app,
        "name",
      ],
    },
    subdomain: {
      propDefinition: [
        app,
        "subdomain",
      ],
    },
    category: {
      propDefinition: [
        app,
        "category",
      ],
      optional: true,
    },
    size: {
      propDefinition: [
        app,
        "size",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.createOrganization({
      $,
      data: {
        name: this.name,
        subdomain: this.subdomain,
        category: this.category,
        size: this.size,
      },
    });

    if (response?.id) {
      $.export("$summary", `Successfully created a new organization with ID ${response.id}`);
    }

    return response;
  },
};
