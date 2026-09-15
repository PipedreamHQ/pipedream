import bamboohr from "../../bamboohr.app.mjs";

export default {
  key: "bamboohr-delete-hour-record",
  name: "Delete Hour Record",
  description: "Permanently delete a legacy Hours API record and all its stored revisions (DELETE /timetracking/delete/{id}). This cannot be undone. Use **Get Time Tracking Record** to confirm the ID first. [See the documentation](https://documentation.bamboohr.com/reference/delete-time-tracking-hour-record)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  ai: "optimized",
  props: {
    bamboohr,
    recordId: {
      propDefinition: [
        bamboohr,
        "recordId",
      ],
      description: "The ID of the hour record to delete, e.g. `550e8400-e29b-41d4-a716-446655440000` (the UUID you supplied in **Create Hour Record**). Run **Get Time Tracking Record** to confirm it exists first.",
    },
  },
  async run({ $ }) {
    const response = await this.bamboohr.deleteHourRecord({
      $,
      recordId: this.recordId,
    });
    $.export("$summary", `Deleted hour record ${this.recordId}`);
    return response;
  },
};
