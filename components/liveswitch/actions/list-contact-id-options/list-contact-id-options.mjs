import { liveswitch } from "../../liveswitch.app.mjs";

export default {
  key: "liveswitch-list-contact-id-options",
  name: "List Contact ID Options",
  description: "Retrieves available options for the Contact ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    liveswitch,
  },
  async run({ $ }) {
    const options = await liveswitch.propDefinitions.contactId.options.call(this.liveswitch, {});
    $.export("$summary", `Successfully retrieved ${options.length} option${
      options.length === 1
        ? ""
        : "s"
    }`);
    return options;
  },
};
