import app from "../../apifreaks.app.mjs";

export default {
  key: "apifreaks-post-phone-validation-bulk",
  name: "Bulk Validate Phone Numbers",
  description: "Validates up to 100 phone numbers in a single request. Each number is processed independently — invalid entries return per-number errors without affecting the rest of the batch. [See the documentation](https://apifreaks.com/docs).",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    numbers: {
      type: "string",
      label: "Numbers",
      description: "Array of phone number objects. Maximum 100 per request.",
      optional: false,
    },
  },
  async run({ $ }) {
    const response = await this.app._makeRequest({
      $,
      method: "POST",
      path: "/v1.0/phone/validation/bulk",
      data: {
        numbers: this.numbers,
      },
    });
    $.export("$summary", "Successfully executed Bulk Validate Phone Numbers");
    return response;
  },
};
