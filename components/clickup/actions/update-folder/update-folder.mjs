import clickup from "../../clickup.app.mjs";

export default {
  key: "clickup-update-folder",
  name: "Update Folder",
  description: "Update a folder. See the docs [here](https://clickup.com/api) in **Folders  / Update Folder** section.",
  version: "0.0.1",
  type: "action",
  props: {
    clickup,
    workspaceId: {
      propDefinition: [
        clickup,
        "workspaces",
      ],
      optional: true,
    },
    spaceId: {
      propDefinition: [
        clickup,
        "spaces",
        (c) => ({
          workspaceId: c.workspaceId,
        }),
      ],
    },
    folderId: {
      propDefinition: [
        clickup,
        "folders",
        (c) => ({
          spaceId: c.spaceId,
        }),
      ],
    },
    name: {
      label: "Name",
      type: "string",
      description: "The name of folder",
    },
    hidden: {
      label: "Hidden",
      type: "boolean",
      description: "Folder will be set hidden",
      default: false,
    },
  },
  async run({ $ }) {
    const {
      folderId,
      name,
      hidden,
    } = this;

    return this.clickup.updateFolder({
      $,
      folderId,
      data: {
        name,
        hidden,
      },
    });
  },
};
