import clickup from "../../clickup.app.mjs";

export default {
  key: "clickup-get-space",
  name: "Get Space",
  description: "Get a space in a workplace. See the docs [here](https://clickup.com/api) in **Spaces  / Get Space** section.",
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
  },
  async run({ $ }) {
    const { spaceId } = this;

    return this.clickup.getSpace({
      $,
      spaceId,
    });
  },
};
