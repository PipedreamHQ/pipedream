// x-pd-ai: optimized
import wrike from "../../wrike.app.mjs";
import { parseJson } from "../../common/utils.mjs";

export default {
  key: "wrike-create-folder",
  name: "Create Folder",
  description: "Create a folder (or a project, by supplying the optional project object) under a parent folder via POST /folders/{folderId}/folders. Supplying the 'project' prop switches creation into project mode; there is no separate create-project action. Use **List Folder ID Options** or **List Space ID Options** to obtain a parent folder ID. [See the documentation](https://developers.wrike.com/reference/postfolderssinglefolders)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    wrike,
    parentFolderId: {
      type: "string",
      label: "Parent Folder ID",
      description: "The ID of the parent folder to create under (path param, e.g. `IEAASDF3`); use the account root folder ID to create at the root. Run **List Folder ID Options** to look up IDs.",
    },
    title: {
      type: "string",
      label: "Title",
      description: "Title of the new folder or project. Cannot be empty.",
    },
    description: {
      type: "string",
      label: "Description",
      description: "Description of the new folder or project.",
      optional: true,
    },
    project: {
      type: "string",
      label: "Project",
      description: "JSON object enabling project mode. Example: `{\"status\":\"Green\",\"startDate\":\"2026-07-23\",\"endDate\":\"2026-09-30\"}`. Status is one of `Red`, `OnHold`, `Yellow`, `Completed`, `Custom`, `Cancelled`, `Green`. Omit to create a plain folder.",
      optional: true,
    },
    shareds: {
      type: "string[]",
      label: "Shareds",
      description: "Contact IDs to share the folder with. Run **List Contact ID Options** to look up IDs.",
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
    const folder = await this.wrike.createFolder({
      $,
      folderId: this.parentFolderId,
      data: {
        title: this.title,
        description: this.description,
        project: parseJson(this.project),
        shareds: this.shareds,
        customFields: parseJson(this.customFields),
      },
    });

    $.export("$summary", `Successfully created folder "${folder.title}" (${folder.id})`);
    return folder;
  },
};
