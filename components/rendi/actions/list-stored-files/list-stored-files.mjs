import rendi from "../../rendi.app.mjs";

export default {
  key: "rendi-list-stored-files",
  name: "List Stored Files",
  description: "Get the list of all stored files for an account. [See the documentation](https://docs.rendi.dev/api-reference/endpoint/list-files)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    rendi,
  },
  async run({ $ }) {
    const response = await this.rendi.listFiles({
      $,
    });
    $.export("$summary", `Successfully retrieved ${response.length} file${response.length === 1
      ? ""
      : "s"}`);
    return response;
  },
};
