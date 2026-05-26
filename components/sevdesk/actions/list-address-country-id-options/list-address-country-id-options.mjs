import sevdesk from "../../sevdesk.app.mjs";

export default {
  key: "sevdesk-list-address-country-id-options",
  name: "List Address Country ID Options",
  description: "Retrieves available options for the Address Country ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    sevdesk,
  },
  async run({ $ }) {
    const options = await sevdesk.propDefinitions.addressCountryId.options.call(this.sevdesk);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
