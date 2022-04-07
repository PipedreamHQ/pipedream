import clickup from "../../clickup.app.mjs";

export default {
  key: "clickup-update-space",
  name: "Update Space",
  description: "Update a space. See the docs [here](https://clickup.com/api) in **Spaces  / Update Space** section.",
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
      description: "The name of space",
    },
    _private: {
      label: "Private",
      type: "boolean",
      description: "Space will be privated",
      default: false,
    },
  },
  async run({ $ }) {
    const {
      spaceId,
      name,
      _private,
    } = this;

    return this.clickup.updateSpace({
      $,
      spaceId,
      data: {
        name,
        private: _private,
      },
    });
  },
};
