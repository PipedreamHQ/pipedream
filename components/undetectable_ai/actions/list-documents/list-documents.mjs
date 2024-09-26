import app from "../../undetectable_ai.app.mjs";

export default {
  key: "undetectable_ai-list-documents",
  name: "List Documents",
  description: "Retrieve the IDs of documents associated with your account. [See the documentation](https://docs.undetectable.ai/#list-documents)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    page: {
      propDefinition: [
        app,
        "page",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.listDocuments({
      $,
      data: {
        page: this.page,
      },
    });

    $.export("$summary", `Successfully retrieved '${response.documents.length}' documents`);

    return response;
  },
};
