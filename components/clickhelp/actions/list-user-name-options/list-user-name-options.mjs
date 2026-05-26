import clickhelp from "../../clickhelp.app.mjs";

export default {
  key: "clickhelp-list-user-name-options",
  name: "List User Name Options",
  description: "Retrieves available options for the User Name field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    clickhelp,
  },
  async run({ $ }) {
    const options = await clickhelp.propDefinitions.userName.options.call(this.clickhelp);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
