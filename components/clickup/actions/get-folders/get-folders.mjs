import clickup from "../../clickup.app.mjs";

export default {
  key: "clickup-get-folders",
  name: "Get Folders",
  description: "Get a list of folders in a workplace. See the docs [here](https://clickup.com/api) in **Folders  / Get Folders** section.",
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
    archived: {
      type: "boolean",
      label: "Archived",
      description: "Filter for archived folders",
      default: false,
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      spaceId,
      archived,
    } = this;

    return this.clickup.getFolders({
      $,
      spaceId,
      params: {
        archived,
      },
    });
  },
};
