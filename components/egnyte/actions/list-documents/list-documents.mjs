import egnyte from "../../egnyte.app.mjs";

export default {
  key: "egnyte-list-documents",
  name: "List Documents",
  description: "List documents in your Egnyte workspace. [See the documentation](https://developers.egnyte.com/api-docs/read/file-system-management-api-documentation)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    egnyte,
    folderPath: {
      propDefinition: [
        egnyte,
        "folderPath",
      ],
      description: "List documents within this folder. Search for a folder to select or enter a folder path manually. Defaults to the root folder.",
      optional: true,
    },
  },
  async run({ $ }) {
    const { files } = await this.egnyte.getFolder({
      $,
      folderPath: this.folderPath
        ? this.folderPath.replace(/^\//, "")
        : "",
    });
    $.export("$summary", `Successfully retrieved ${files?.length || 0} document${files?.length != 1
      ? "s"
      : ""}.`);
    return files || [];
  },
};
