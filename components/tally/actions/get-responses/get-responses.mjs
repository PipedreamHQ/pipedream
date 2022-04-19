import tally from "../../tally.app.mjs";

export default {
  name: "Get Responses",
  version: "0.0.1",
  key: "tally-get-responses",
  description: "Get a list of responses. [See docs here](https://tallyso.notion.site/Tally-OAuth-2-reference-d0442c679a464664823628f675f43454)",
  type: "action",
  dedupe: "unique",
  props: {
    tally,
    formId: {
      propDefinition: [
        tally,
        "forms",
      ],
    },
    page: {
      label: "Page",
      description: "The page for retrieve responses, starts with 1",
      type: "integer",
      min: 1,
      default: 1,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.tally.getResponses({
      formId: this.formId,
      page: this.page,
      $,
    });

    $.export("$summary", "Successfully retrieved responses");

    return response;
  },
};
