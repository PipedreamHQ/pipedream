import cisco_meraki from "../../cisco_meraki.app.mjs";

export default {
  key: "cisco_meraki-list-org-id-options",
  name: "List Org ID Options",
  description: "Retrieves available options for the Org ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    cisco_meraki,
  },
  async run({ $ }) {
    const options = await cisco_meraki.propDefinitions.orgId.options.call(this.cisco_meraki, {});
    $.export("$summary", `Successfully retrieved ${options.length} option${
      options.length === 1
        ? ""
        : "s"
    }`);
    return options;
  },
};
