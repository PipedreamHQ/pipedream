import common from "../common/common.mjs";

export default {
  key: "clickup-create-space",
  name: "Create Space",
  description: "Creates a new space. See the docs [here](https://clickup.com/api) in **Spaces  / Create Space** section.",
  version: "0.0.1",
  type: "action",
  props: {
    ...common.props,
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
      workspaceId,
      name,
      _private,
    } = this;

    const response = await this.clickup.createSpace({
      $,
      workspaceId,
      data: {
        name,
        private: _private,
      },
    });

    $.export("$summary", "Successfully created space");

    return response;
  },
};
