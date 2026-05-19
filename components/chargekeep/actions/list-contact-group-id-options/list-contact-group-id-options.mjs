import chargekeep from "../../chargekeep.app.mjs";

export default {
  key: "chargekeep-list-contact-group-id-options",
  name: "List Contact Group ID Options",
  description: "Retrieves available options for the Contact Group ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    chargekeep,
  },
  async run({ $ }) {
    const options = await chargekeep.propDefinitions.contactGroupId.options.call(this.chargekeep);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
