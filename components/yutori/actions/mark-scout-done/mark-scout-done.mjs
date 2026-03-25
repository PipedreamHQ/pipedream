import yutori from "../../yutori.app.mjs";

export default {
  key: "yutori-mark-scout-done",
  name: "Mark Scout as Done",
  description: "Archive a Yutori Scout and permanently stop it from running. All past findings are preserved. Use **Restart Scout** to reactivate it later. [See the documentation](https://docs.yutori.com/reference/scouts-complete)",
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
      description: "The ID of the scout to mark as done, e.g. `{{steps.create_scout.$return_value.id}}`",
    },
  },
  async run({ $ }) {
    const result = await this.yutori.markScoutDone($, this.scoutId);

    $.export("$summary", `Scout marked as done: ${this.scoutId}`);
    return result;
  },
};
