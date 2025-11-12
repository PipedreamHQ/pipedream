import common from "../common/space-props.mjs";

export default {
  ...common,
  key: "clickup-delete-space",
  name: "Delete Space",
  description: "Delete a space. [See the documentation](https://clickup.com/api) in **Spaces / Delete Space** section.",
  version: "0.0.13",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  async run({ $ }) {
    const { spaceId } = this;

    const response = await this.clickup.deleteSpace({
      $,
      spaceId,
    });

    $.export("$summary", "Successfully deleted space");

    return response;
  },
};
