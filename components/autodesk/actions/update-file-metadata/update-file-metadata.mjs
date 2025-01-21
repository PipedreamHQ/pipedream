import autodesk from "../../autodesk.app.mjs";

export default {
  key: "autodesk-update-file-metadata",
  name: "Update File Metadata",
  description: "Updates metadata for an existing file in Autodesk. [See the documentation](https://aps.autodesk.com/en/docs/data/v2/reference/http/projects-project_id-items-item_id-PATCH/)",
  version: "0.0.1",
  type: "action",
  props: {
    autodesk,
    hubId: {
      propDefinition: [
        autodesk,
        "hubId",
      ],
    },
    projectId: {
      propDefinition: [
        autodesk,
        "projectId",
        (c) => ({
          hubId: c.hubId,
        }),
      ],
    },
    parent: {
      propDefinition: [
        autodesk,
        "folderId",
        (c) => ({
          hubId: c.hubId,
          projectId: c.projectId,
        }),
      ],
      label: "Parent Folder ID",
      description: "The identifier of the file's parent folder",
    },
    fileId: {
      propDefinition: [
        autodesk,
        "fileId",
        (c) => ({
          projectId: c.projectId,
          folderId: c.parent,
        }),
      ],
    },
    metadata: {
      type: "string",
      label: "Metadata",
      description: "An object containing key-value pairs of the attributes to update. Example: `{ \"displayName\": \"newFileName.jpg\"}`",
    },
  },
  async run({ $ }) {
    const response = await this.autodesk.updateMetadata({
      $,
      projectId: this.projectId,
      fileId: this.fileId,
      data: {
        jsonapi: {
          version: "1.0",
        },
        data: {
          type: "items",
          id: this.fileId,
          attributes: typeof this.metadata === "string"
            ? JSON.parse(this.metadata)
            : this.metadata,
        },
      },
    });
    $.export("$summary", `Updated metadata for file ${this.fileId}`);
    return response;
  },
};
