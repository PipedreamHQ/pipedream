import aidbase from "../../aidbase.app.mjs";

export default {
  key: "aidbase-create-faq",
  name: "Create FAQ",
  description: "Create a new frequently asked questions (FAQ) list on your Aidbase account. [See the documentation](https://docs.aidbase.ai/apis/knowledge-api/reference/#post-knowledgefaq)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    aidbase,
    title: {
      type: "string",
      label: "Title",
      description: "The title of the FAQ",
    },
    description: {
      type: "string",
      label: "Description",
      description: "The description of the FAQ",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.aidbase.createFaq({
      $,
      data: {
        title: this.title,
        description: this.description,
      },
    });
    $.export("$summary", `Successfully created FAQ with ID ${response.data.id}`);
    return response;
  },
};
