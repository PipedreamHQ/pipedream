import pipedrive from "../../pipedrive.app.mjs";

export default {
  key: "pipedrive-list-organization-label-ids-options",
  name: "List Organization Label IDs Options",
  description: "Lists the labels that can be applied to organizations, as `{ label, value }` pairs where `value` is the label's numeric ID and `label` its display name."
    + " Use a `value` in **Add Labels** / **Remove Labels** with `Entity Type` set to `organization`."
    + " Returns every configured label, not only those currently in use. Example output: `[{ \"label\": \"Hot\", \"value\": 5 }]`."
    + " [See the documentation](https://developers.pipedrive.com/docs/api/v1/OrganizationFields#getOrganizationFields)",
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
    const options = await pipedrive.propDefinitions.organizationLabelIds.options
      .call(this.pipedrive);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
