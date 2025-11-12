import common from "../common/space-props.mjs";

export default {
  ...common,
  key: "clickup-update-space",
  name: "Update Space",
  description: "Update a space. [See the documentation](https://clickup.com/api) in **Spaces / Update Space** section.",
  version: "0.0.13",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
      spaceId,
      name,
      _private,
    } = this;

    const response = await this.clickup.updateSpace({
      $,
      spaceId,
      data: {
        name,
        private: _private,
      },
    });

    $.export("$summary", "Successfully updated space");

    return response;
  },
};
