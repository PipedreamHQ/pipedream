import { mailmodo } from "../../mailmodo.app.mjs";

export default {
  key: "mailmodo-list-campaign-id-options",
  name: "List Campaign ID Options",
  description: "Retrieves available options for the Campaign ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    mailmodo,
  },
  async run({ $ }) {
    const options = await mailmodo.propDefinitions.campaignId.options.call(this.mailmodo, {});
    $.export("$summary", `Successfully retrieved ${options.length} option${
      options.length === 1
        ? ""
        : "s"
    }`);
    return options;
  },
};
