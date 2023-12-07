import app from "../../documint.app.mjs";

export default {
  name: "Create Document",
  version: "0.0.1",
  key: "documint-create-document",
  description: "Create a document. [See the documentation](https://documenter.getpostman.com/view/11741160/TVK5cLxQ#032798a4-6eb6-43cd-9c1b-9ba313f7d39c)",
  type: "action",
  props: {
    app,
    templateId: {
      propDefinition: [
        app,
        "templateId",
      ],
    },
    variables: {
      label: "Variables",
      description: "Variables to merge with template. E.g. `{ \"company\": \"Pipedream\" }`",
      type: "object",
    },
  },
  async run({ $ }) {
    const variables = typeof this.variables === "string"
      ? JSON.parse(this.variables)
      : this.variables;

    const response = await this.app.createDocument({
      $,
      templateId: this.templateId,
      params: {
        active: true,
        preview: true,
      },
      data: {
        ...variables,
      },
    });

    if (response) {
      $.export("$summary", `Successfully created document with ID \`${response.id}\``);
    }

    return response;
  },
};
