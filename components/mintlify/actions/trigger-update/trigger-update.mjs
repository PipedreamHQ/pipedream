import mintlify from "../../mintlify.app.mjs";

export default {
  key: "mintlify-trigger-update",
  name: "Trigger Update",
  description: "Trigger an update for a project. [See the documentation](https://www.mintlify.com/docs/api-reference/update/trigger)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    mintlify,
  },
  async run({ $ }) {
    const response = await this.mintlify.triggerUpdate({
      $,
    });

    $.export("$summary", `Successfully triggered an update for project ${this.mintlify.$auth.project_id}`);

    return response;
  },
};
