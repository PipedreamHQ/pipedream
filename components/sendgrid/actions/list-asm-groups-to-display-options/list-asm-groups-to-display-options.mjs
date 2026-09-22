import sendgrid from "../../sendgrid.app.mjs";

export default {
  key: "sendgrid-list-asm-groups-to-display-options",
  name: "List ASM Groups to Display Options",
  description: "Retrieves available options for the ASM Groups to Display field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    sendgrid,
  },
  async run({ $ }) {
    const options = await sendgrid.propDefinitions.asmGroupsToDisplay.options
      .call(this.sendgrid);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
