import aidbase from "../../aidbase.app.mjs";

export default {
  key: "aidbase-list-faq-id-options",
  name: "List Faq ID Options",
  description: "Retrieves available options for the Faq ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    aidbase,
  },
  async run({ $ }) {
    const options = await aidbase.propDefinitions.faqId.options.call(this.aidbase, {});
    $.export("$summary", `Successfully retrieved ${options.length} option${
      options.length === 1
        ? ""
        : "s"
    }`);
    return options;
  },
};
