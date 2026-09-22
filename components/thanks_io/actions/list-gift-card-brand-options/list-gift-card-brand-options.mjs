import thanks_io from "../../thanks_io.app.mjs";

export default {
  key: "thanks_io-list-gift-card-brand-options",
  name: "List Brand Options",
  description: "Retrieves available options for the Brand field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    thanks_io,
  },
  async run({ $ }) {
    const options = await thanks_io.propDefinitions.giftCardBrand.options.call(this.thanks_io);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
