// x-pd-ai: optimized
import wrike from "../../wrike.app.mjs";
import { parseJson } from "../../common/utils.mjs";

export default {
  key: "wrike-update-folder",
  name: "Update Folder",
  description: "Update a folder or project's metadata via PUT /folders/{folderId}. Supply the optional 'project' prop to set project attributes (or null to convert a project back to a folder); there is no separate update-project action. Use **List Folder ID Options** to obtain the folderId. [See the documentation](https://developers.wrike.com/reference/putfolderssingle)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    wrike,
    folderId: {
      type: "string",
      label: "Folder ID",
      description: "The ID of the folder or project to update, e.g. `IEAASDF3`. Run **List Folder ID Options** to look up IDs.",
    },
    title: {
      type: "string",
      label: "Title",
      description: "New folder/project title.",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "New folder/project description.",
      optional: true,
    },
    project: {
      type: "string",
      label: "Project",
      description: "JSON object of project attributes. Example: `{\"status\":\"Yellow\"}`. Status is one of `Red`, `OnHold`, `Yellow`, `Completed`, `Custom`, `Cancelled`, `Green`. Send JSON `null` to convert a project back into a plain folder.",
      optional: true,
    },
    addParents: {
      type: "string[]",
      label: "Add Parents",
      description: "Folder IDs to add as parents. Run **List Folder ID Options** to look up IDs.",
      optional: true,
    },
    removeParents: {
      type: "string[]",
      label: "Remove Parents",
      description: "Folder IDs to remove as parents.",
      optional: true,
    },
    customFields: {
      type: "string",
      label: "Custom Fields",
      description: "JSON array of custom field objects. Example: `[{\"id\":\"IEAASDF3JQAAAAAA\",\"value\":\"Q3\"}]`. Run **List Custom Fields Keys Options** to discover valid field IDs.",
      optional: true,
    },
  },
  async run({ $ }) {
    const folder = await this.wrike.updateFolder({
      $,
      folderId: this.folderId,
      data: {
        title: this.title,
        description: this.description,
        project: parseJson(this.project),
        addParents: this.addParents,
        removeParents: this.removeParents,
        customFields: parseJson(this.customFields),
      },
    });

    $.export("$summary", `Successfully updated folder "${folder.title}" (${folder.id})`);
    return folder;
  },
};
