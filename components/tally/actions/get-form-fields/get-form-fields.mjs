import tally from "../../tally.app.mjs";

export default {
  name: "Get Form Fields",
  version: "0.0.1",
  key: "tally-get-form-fields",
  description: "Get the fields of a form. [See docs here](https://tallyso.notion.site/Tally-OAuth-2-reference-d0442c679a464664823628f675f43454)",
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
    const response = await this.tally.getFormFields({
      formId: this.formId,
      $,
    });

    $.export("$summary", "Successfully retrieved form fields");

    return response;
  },
};
