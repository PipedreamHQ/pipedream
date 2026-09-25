import pipedrive from "../../pipedrive.app.mjs";

export default {
  key: "pipedrive-list-deal-label-ids-options",
  name: "List Deal Label IDs Options",
  description: "Lists the labels that can be applied to deals, as `{ label, value }` pairs where `value` is the numeric label ID and `label` its display name."
    + " Use a `value` in the `Label IDs` of **Add Deal**, or in **Add Labels** / **Remove Labels** with `Entity Type` set to `deal`."
    + " Deal labels are defined in the deal `label` field's options, so this returns every configured label, not only those in use."
    + " [See the documentation](https://developers.pipedrive.com/docs/api/v1/DealFields#getDealFields)",
  version: "0.0.1",
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
    const options = await pipedrive.propDefinitions.labelIds.options.call(this.pipedrive);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
