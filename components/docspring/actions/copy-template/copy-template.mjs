import docspring from "../../docspring.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "docspring-copy-template",
  name: "Copy Template",
  description: "Copy a template's draft, or one of its published versions, to a new template. Returns the copy."
    + " Use **Find Templates** to find the template and **List Folders** for the folder."
    + " [See the documentation](https://docspring.com/docs/api/#tag/templates/post/templates/{template_id}/copy)",
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
    name: {
      type: "string",
      label: "Name",
      description: "The copy's name, e.g. `Rental Agreement (Spanish)`. Leave blank for the template's name followed by a number, such as `Rental Agreement (2)`.",
      optional: true,
    },
    folderId: {
      propDefinition: [
        docspring,
        "folderId",
        () => ({
          includeRoot: true,
        }),
      ],
      description: "The folder to put the copy in, e.g. `fld_1234567890abcdef01`, or `root` for the root folder."
        + " Use **List Folders** to find it (the `id` field). Leave blank to put it in the template's own folder.",
      optional: true,
    },
    publishedVersion: {
      type: "string",
      label: "Published Version",
      description: "Copy this published version instead of the draft, e.g. `1.2.0` (or `1` for the latest 1.x.x). Leave blank to copy the draft.",
      optional: true,
    },
  },
  async run({ $ }) {
    const body = utils.compact({
      name: this.name,
      version: this.publishedVersion,
    });
    const folder = utils.folderValue(this.folderId);
    if (folder !== undefined) {
      body.parent_folder_id = folder;
    }
    const copy = await this.docspring.copyTemplate({
      $,
      templateId: this.templateId,
      data: body,
    });
    $.export("$summary", `Copied template ${this.templateId} to ${copy.id}: ${copy.name}`);
    return copy;
  },
};
