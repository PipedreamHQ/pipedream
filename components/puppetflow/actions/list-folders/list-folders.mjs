import puppetflow from "../../puppetflow.app.mjs";

export default {
  key: "puppetflow-list-folders",
  name: "List Folders",
  description: "List the folders the connected API key can access, optionally filtered by name."
    + " Returns each folder's `id`, `name`, `parent_id` and `is_shared`."
    + " Use it to find the folder ID accepted by **List Flows**."
    + " [See the documentation](https://docs.puppetflow.com/reference/api/flows#list-folders)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    puppetflow,
    search: {
      propDefinition: [
        puppetflow,
        "search",
      ],
      description: "Text matched against the folder name, e.g. `Production`.",
    },
  },
  async run({ $ }) {
    const folders = await this.puppetflow.listFolders({
      $,
      params: {
        search: this.search,
      },
    });

    $.export("$summary", `Found ${folders.length} folder${folders.length === 1
      ? ""
      : "s"}`);
    return folders;
  },
};
