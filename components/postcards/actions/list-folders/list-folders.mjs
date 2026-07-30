import postcards from "../../postcards.app.mjs";

export default {
  key: "postcards-list-folders",
  name: "List Folders",
  description: "List all folders in the authenticated team. [See the docs](https://help.designmodo.com/article/537-api-getting-started).",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    postcards,
    maxResults: {
      propDefinition: [
        postcards,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const folders = await this.postcards.getResources({
      resourceFn: (opts) => this.postcards.listFolders({
        $,
        ...opts,
      }),
      max: this.maxResults,
    });
    $.export("$summary", `Listed ${folders.length} folder(s)`);
    return folders;
  },
};
