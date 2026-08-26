// x-pd-ai: optimized
import intercom from "../../intercom.app.mjs";

export default {
  key: "intercom-list-admin-id-options",
  name: "List Admin ID Options",
  description: "Retrieves all admins in your Intercom workspace and returns their IDs and names. Call this action before any action that requires an Admin ID — such as **Manage A Conversation**, **Reply To Conversation**, or **Send Message To Contact** — to discover valid values. Example: returns `[{ label: \"Jane Doe\", value: \"25\" }, ...]`. [See the documentation](https://developers.intercom.com/docs/references/rest-api/api.intercom.io/admins/listadmins).",
  version: "0.0.3",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    intercom,
  },
  async run({ $ }) {
    const { admins } = await this.intercom.listAdmins();
    const options = admins.map(({
      id: value, name: label,
    }) => ({
      label,
      value,
    }));
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
