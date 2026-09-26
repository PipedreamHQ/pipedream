import pipedrive from "../../pipedrive.app.mjs";

export default {
  key: "pipedrive-list-lead-label-ids-options",
  name: "List Lead Label IDs Options",
  description: "Lists the labels that can be applied to leads, as `{ label, value }` pairs where `value` is the label's UUID string and `label` its display name."
    + " Use a `value` in the `Lead Label IDs` of **Add Lead**, or in **Add Labels** / **Remove Labels** with `Entity Type` set to `lead`."
    + " Returns every configured label, not only those currently in use. Example output: `[{ \"label\": \"Hot\", \"value\": \"f08b42a0-4e75-11ea-9643-03698ef1cfd6\" }]`."
    + " [See the documentation](https://developers.pipedrive.com/docs/api/v1/LeadLabels#getLeadLabels)",
  version: "0.0.3",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    pipedrive,
  },
  async run({ $ }) {
    const options = await pipedrive.propDefinitions.leadLabelIds.options.call(this.pipedrive);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
