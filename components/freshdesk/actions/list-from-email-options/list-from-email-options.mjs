import freshdesk from "../../freshdesk.app.mjs";

export default {
  key: "freshdesk-list-from-email-options",
  name: "List From Email Options",
  description: "Retrieves available options for the From Email field.",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    freshdesk,
  },
  async run({ $ }) {
    const options = await freshdesk.propDefinitions.fromEmail.options.call(this.freshdesk);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
