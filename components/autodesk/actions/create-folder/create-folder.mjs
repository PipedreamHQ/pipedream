import autodesk from "../../autodesk.app.mjs";

export default {
  key: "autodesk-create-folder",
  name: "Create Folder",
  description: "Creates a new folder in a project in Autodesk. [See the documentation](https://aps.autodesk.com/en/docs/data/v2/reference/http/projects-project_id-folders-POST/)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
    name: {
      type: "string",
      label: "Name",
      description: "The name of the new folder",
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
      description: "The identifier of the parent folder",
    },
    type: {
      type: "string",
      label: "Extension Type",
      description: "The type of folder extension. For BIM 360 Docs folders, use `folders:autodesk.bim360:Folder`. For all other services, use `folders:autodesk.core:Folder`.",
      options: [
        {
          label: "BIM 360 Docs folders",
          value: "folders:autodesk.core:Folder",
        },
        {
          label: "Other folders",
          value: "folders:autodesk.bim360:Folder",
        },
      ],
      default: "folders:autodesk.core:Folder",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.autodesk.createFolder({
      $,
      projectId: this.projectId,
      data: {
        jsonapi: {
          version: "1.0",
        },
        data: {
          type: "folders",
          attributes: {
            name: this.name,
            extension: {
              type: this.type,
              version: "1.0",
            },
          },
          relationships: {
            parent: {
              data: {
                type: "folders",
                id: this.parent,
              },
            },
          },
        },
      },
    });
    $.export("$summary", `Successfully created new folder: ${this.name}`);
    return response;
  },
};
