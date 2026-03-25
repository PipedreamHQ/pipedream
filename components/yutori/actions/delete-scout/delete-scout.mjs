import yutori from "../../yutori.app.mjs";

export default {
  key: "yutori-delete-scout",
  name: "Delete Scout",
  description: "Permanently delete a Yutori Scout and all its findings. This action cannot be undone. To temporarily stop a scout, use **Mark Scout as Done** instead. [See the documentation](https://docs.yutori.com/reference/scouting-delete)",
  version: "0.0.1",
  type: "action",
  annotations: {
    openWorldHint: true,
    destructiveHint: true,
    readOnlyHint: false,
  },
  props: {
    yutori,
    scoutId: {
      type: "string",
      label: "Scout ID",
      description: "The ID of the scout to delete, e.g. `{{steps.create_scout.$return_value.id}}`",
    },
  },
  async run({ $ }) {
    const result = await this.yutori.deleteScout($, this.scoutId);

    $.export("$summary", `Scout deleted: ${this.scoutId}`);
    return result;
  },
};
