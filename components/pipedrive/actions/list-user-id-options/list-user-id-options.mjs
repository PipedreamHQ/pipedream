import pipedrive from "../../pipedrive.app.mjs";

export default {
  key: "pipedrive-list-user-id-options",
  name: "List User ID Options",
  description: "Lists the users in the Pipedrive company account, as `{ label, value }` pairs where `value` is the numeric user ID and `label` the user's name."
    + " Use a `value` as the owner ID in **Add Deal**, **Update Deal**, **Add Person**, **Update Person**, **Add Organization** or **Add Lead**, or as the user filter in **Search Notes**."
    + " Example output: `[{ \"label\": \"Daniel Okafor\", \"value\": 12345678 }]`."
    + " [See the documentation](https://developers.pipedrive.com/docs/api/v1/Users#getUsers)",
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
    const options = await pipedrive.propDefinitions.userId.options.call(this.pipedrive);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
