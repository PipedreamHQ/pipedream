import wealthbox from "../../wealthbox.app.mjs";

export default {
  key: "wealthbox-list-contact-type-options",
  name: "List Type Options",
  description: "List the user-defined contact type categories configured in Wealthbox (e.g. `Client`, `Prospect`, `Vendor`) so agents and users can discover valid values to pass to the Contact Type prop in **Create Contact**. Returns an array of type name strings. [See the documentation](http://dev.wealthbox.com/#contacts-retrieve-all-contacts-get)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    wealthbox,
  },
  async run({ $ }) {
    const options = await wealthbox.propDefinitions.contactType.options.call(this.wealthbox);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
