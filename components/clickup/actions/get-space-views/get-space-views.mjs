import clickup from "../../clickup.app.mjs";

export default {
  key: "clickup-get-space-views",
  name: "Get Space Views",
  description: "Get all views of a space. See the docs [here](https://clickup.com/api) in **Views  / Get Space Views** section.",
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

    return this.clickup.getSpaceViews({
      $,
      spaceId,
    });
  },
};
