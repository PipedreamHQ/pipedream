import pipedrive from "../../pipedrive.app.mjs";

export default {
  key: "pipedrive-list-person-label-ids-options",
  name: "List Person Label IDs Options",
  description: "Lists the labels that can be applied to people, as `{ label, value }` pairs where `value` is the label's numeric ID and `label` its display name."
    + " Use a `value` in **Add Labels** / **Remove Labels** with `Entity Type` set to `person`."
    + " Returns every configured label, not only those currently in use. Example output: `[{ \"label\": \"Hot\", \"value\": 5 }]`."
    + " [See the documentation](https://developers.pipedrive.com/docs/api/v1/PersonFields#getPersonFields)",
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
    const options = await pipedrive.propDefinitions.personLabelIds.options
      .call(this.pipedrive);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
