import zoho_mail from "../../zoho_mail.app.mjs";

export default {
  key: "zoho_mail-list-account-options",
  name: "List Account ID Options",
  description: "Retrieves available options for the Account ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    zoho_mail,
  },
  async run({ $ }) {
    const options = await zoho_mail.propDefinitions.account.options.call(this.zoho_mail);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
