import common from "../common/space-props.mjs";

export default {
  key: "clickup-delete-space",
  name: "Delete Space",
  description: "Delete a space. See the docs [here](https://clickup.com/api) in **Spaces / Delete Space** section.",
  version: "0.0.7",
  type: "action",
  props: common.props,
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
