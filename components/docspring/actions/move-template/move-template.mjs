import docspring from "../../docspring.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "docspring-move-template",
  name: "Move Template",
  description: "Move a template, with all of its published versions, to another folder or to the root folder. Returns the template, with its new `path`."
    + " Use **List Folders** to find the folder, or **Create Folder** to make one."
    + " [See the documentation](https://docspring.com/docs/api/#tag/templates/post/templates/{template_id}/move)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    docspring,
    templateId: {
      propDefinition: [
        docspring,
        "templateId",
      ],
    },
    folderId: {
      propDefinition: [
        docspring,
        "folderId",
        () => ({
          includeRoot: true,
        }),
      ],
      description: "The folder to move the template to, e.g. `fld_1234567890abcdef01`, or `root` for the root folder."
        + " Use **List Folders** to find it (the `id` field).",
    },
  },
  async run({ $ }) {
    const template = await this.docspring.moveTemplate({
      $,
      templateId: this.templateId,
      data: {
        parent_folder_id: utils.folderValue(this.folderId) ?? null,
      },
    });
    $.export("$summary", `Moved template ${template.id} to ${template.path}`);
    return template;
  },
};
