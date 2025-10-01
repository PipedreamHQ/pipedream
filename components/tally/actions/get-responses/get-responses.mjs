import tally from "../../tally.app.mjs";

export default {
  name: "Get Responses",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  key: "tally-get-responses",
  description: "Get a list of responses. [See docs here](https://tallyso.notion.site/Tally-OAuth-2-reference-d0442c679a464664823628f675f43454)",
  type: "action",
  props: {
    tally,
    formId: {
      propDefinition: [
        tally,
        "form",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.tally.getResponses({
      formId: this.formId,
      $,
    });

    $.export("$summary", "Successfully retrieved responses");

    return response;
  },
};
