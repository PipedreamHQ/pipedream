import hathrAi from "../../hathr_ai.app.mjs";

export default {
  key: "hathr_ai-list-documents",
  name: "List Documents",
  description: "Retrieves a list of all available documents. [See the documentation](https://drive.google.com/drive/folders/1jtoSXqzhe-iwf9kfUwTCVQBu4iXVJO2x?usp=sharing)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    hathrAi,
  },
  async run({ $ }) {
    const { response: { documents } } = await this.hathrAi.listDocuments({
      $,
    });
    $.export("$summary", `Successfully retrieved ${documents.length} document${documents.length === 1
      ? ""
      : "s"}`);
    return documents;
  },
};
