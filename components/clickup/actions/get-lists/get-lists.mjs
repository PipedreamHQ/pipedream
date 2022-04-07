import clickup from "../../clickup.app.mjs";

export default {
  key: "clickup-get-lists",
  name: "Get Lists",
  description: "Get a list of lists. See the docs [here](https://clickup.com/api) in **Lists  / Get Lists** section.",
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
      optional: true,
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
    archived: {
      type: "boolean",
      label: "Archived",
      description: "Filter for archived lists",
      default: false,
      optional: true,
    },
    folderless: {
      label: "Folderless",
      description: "This list is folderless",
      type: "boolean",
      default: false,
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      folderId,
      archived,
    } = this;

    if (this.folderless) {
      return this.clickup.getFolderlessLists({
        $,
        folderId,
        params: {
          archived,
        },
      });
    }

    return this.clickup.getLists({
      $,
      folderId,
      params: {
        archived,
      },
    });
  },
};
