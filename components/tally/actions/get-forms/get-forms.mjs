import tally from "../../tally.app.mjs";

export default {
  name: "Get Forms",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  key: "tally-get-forms",
  description: "Get a list of forms. [See docs here](https://tallyso.notion.site/Tally-OAuth-2-reference-d0442c679a464664823628f675f43454)",
  type: "action",
  props: {
    tally,
  },
  async run({ $ }) {
    const response = await this.tally.getForms({
      $,
    });

    $.export("$summary", "Successfully retrieved forms");

    return response;
  },
};
