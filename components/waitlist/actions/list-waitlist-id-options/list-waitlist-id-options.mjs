import waitlist from "../../waitlist.app.mjs";

export default {
  key: "waitlist-list-waitlist-id-options",
  name: "List Waitlist Id Options",
  description: "Retrieves available options for the Waitlist Id field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    waitlist,
  },
  async run({ $ }) {
    const options = await waitlist.propDefinitions.waitlistId.options.call(this.waitlist);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
