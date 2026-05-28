import { krispcall } from "../../krispcall.app.mjs";

export default {
  key: "krispcall-list-contact-ids-options",
  name: "List Contact IDs Options",
  description: "Retrieves available options for the Contact IDs field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    krispcall,
  },
  async run({ $ }) {
    const options = await krispcall.propDefinitions.contactIds.options.call(this.krispcall, {});
    $.export("$summary", `Successfully retrieved ${options.length} option${
      options.length === 1
        ? ""
        : "s"
    }`);
    return options;
  },
};
