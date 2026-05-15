import sms_everyone from "../../sms_everyone.app.mjs";

export default {
  key: "sms_everyone-list-crmids-options",
  name: "List CRM IDs Options",
  description: "Retrieves available options for the CRM IDs field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    sms_everyone,
  },
  async run({ $ }) {
    const options = await sms_everyone.propDefinitions.crmids.options.call(this.sms_everyone);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
