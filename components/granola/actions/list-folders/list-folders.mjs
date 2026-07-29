import granola from "../../granola.app.mjs";

export default {
  key: "granola-list-folders",
  name: "List Folders",
  description: "List accessible folders. Includes folder hierarchy via `parent_folder_id`. [See the documentation](https://docs.granola.ai/api-reference/list-folders)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    granola,
    maxResults: {
      propDefinition: [
        granola,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const {
      granola, maxResults,
    } = this;

    const folders = [];
    const results = granola.paginate({
      $,
      fn: granola.listFolders,
      resourceKey: "folders",
      max: maxResults,
    });

    for await (const folder of results) {
      folders.push(folder);
    }

    $.export("$summary", `Successfully retrieved ${folders.length} folder(s)`);
    return folders;
  },
};
