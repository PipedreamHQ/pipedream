import docspring from "../../docspring.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "docspring-find-templates",
  name: "Find Templates",
  description: "Find templates by name, optionally in one folder. Returns a list of template summaries, newest first (`id`, `name`, `path`, `ready`, `document` and settings)."
    + " Use **Get Template** for one template's full settings and **List Template Fields** for its fields."
    + " [See the documentation](https://docspring.com/docs/api/#tag/templates/get/templates)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    docspring,
    query: {
      type: "string",
      label: "Name",
      description: "Only find templates whose name contains this text (ignoring case), e.g. `rental`. Leave blank for every template.",
      optional: true,
    },
    folderId: {
      propDefinition: [
        docspring,
        "folderId",
      ],
      description: "Only find the templates in this folder (not in its subfolders), e.g. `fld_1234567890abcdef01`."
        + " Use **List Folders** to find it (the `id` field).",
      optional: true,
    },
    maxResults: {
      propDefinition: [
        docspring,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const templates = [];
    const pages = this.docspring.paginate({
      fn: this.docspring.listTemplates,
      args: {
        $,
        params: utils.compact({
          query: this.query,
          parent_folder_id: this.folderId,
        }),
      },
      max: utils.maxResults(this.maxResults),
    });
    for await (const template of pages) {
      templates.push(template);
    }
    $.export("$summary", `Found ${templates.length} template(s)`);
    return templates;
  },
};
