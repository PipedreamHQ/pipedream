import yutori from "../../yutori.app.mjs";

export default {
  key: "yutori-restart-scout",
  name: "Restart Scout",
  description: "Reactivate a Yutori Scout that was previously marked as done. The scout resumes running on its original schedule. [See the documentation](https://docs.yutori.com/reference/scout-restart)",
  version: "0.0.1",
  type: "action",
  annotations: {
    openWorldHint: true,
    destructiveHint: false,
    readOnlyHint: false,
  },
  props: {
    yutori,
    scoutId: {
      type: "string",
      label: "Scout ID",
      description: "The ID of the scout to restart, e.g. `{{steps.create_scout.$return_value.id}}`",
    },
  },
  async run({ $ }) {
    const result = await this.yutori.restartScout($, this.scoutId);

    $.export("$summary", `Scout restarted: ${this.scoutId}`);
    return result;
  },
};
