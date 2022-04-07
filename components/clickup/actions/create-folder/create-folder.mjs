import clickup from "../../clickup.app.mjs";

export default {
  key: "clickup-create-folder",
  name: "Create Folder",
  description: "Creates a new folder. See the docs [here](https://clickup.com/api) in **Folders  / Create Folder** section.",
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
      spaceId,
      name,
      hidden,
    } = this;

    return this.clickup.createFolder({
      $,
      spaceId,
      data: {
        name,
        hidden,
      },
    });
  },
};
