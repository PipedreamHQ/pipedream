import tidy from "../../tidy.app.mjs";

export default {
  key: "tidy-list-address-id-options",
  name: "List Address ID Options",
  description: "Retrieves available options for the Address ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    tidy,
  },
  async run({ $ }) {
    const options = await tidy.propDefinitions.addressId.options.call(this.tidy, {});
    $.export("$summary", `Successfully retrieved ${options.length} option${
      options.length === 1
        ? ""
        : "s"
    }`);
    return options;
  },
};
