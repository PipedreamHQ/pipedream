import common from "../common/space-props.mjs";

export default {
  ...common,
  key: "clickup-delete-space",
  name: "Delete Space",
  description: "Delete a space. See the docs [here](https://clickup.com/api) in **Spaces / Delete Space** section.",
  version: "0.0.8",
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
