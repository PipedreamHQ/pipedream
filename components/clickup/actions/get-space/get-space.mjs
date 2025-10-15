import common from "../common/space-props.mjs";

export default {
  ...common,
  key: "clickup-get-space",
  name: "Get Space",
  description: "Get a space in a workplace. [See the documentation](https://clickup.com/api) in **Spaces / Get Space** section.",
  version: "0.0.12",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  async run({ $ }) {
    const { spaceId } = this;

    const response = await this.clickup.getSpace({
      $,
      spaceId,
    });

    $.export("$summary", "Successfully retrieved space");

    return response;
  },
};
