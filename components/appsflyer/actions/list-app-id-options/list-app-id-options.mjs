import appsflyer from "../../appsflyer.app.mjs";

export default {
  key: "appsflyer-list-app-id-options",
  name: "List App ID Options",
  description: "Retrieves available options for the App ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    appsflyer,
  },
  async run({ $ }) {
    const options = await appsflyer.propDefinitions.appId.options.call(this.appsflyer);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
