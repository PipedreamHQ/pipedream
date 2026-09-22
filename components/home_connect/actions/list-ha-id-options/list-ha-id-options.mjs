import home_connect from "../../home_connect.app.mjs";

export default {
  key: "home_connect-list-ha-id-options",
  name: "List Home Appliance ID Options",
  description: "Retrieves available options for the Home Appliance ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    home_connect,
  },
  async run({ $ }) {
    const options = await home_connect.propDefinitions.haId.options.call(this.home_connect);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
