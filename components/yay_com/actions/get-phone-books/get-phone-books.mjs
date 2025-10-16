import yayCom from "../../yay_com.app.mjs";

export default {
  key: "yay_com-get-phone-books",
  name: "Get Phone Books",
  description: "Retrieves all phone books available. [See the documentation](https://www.yay.com/voip/api-docs/phone-books/phone-book/)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    yayCom,
  },
  async run({ $ }) {
    const response = await this.yayCom.listPhoneBooks({
      $,
    });
    const { length } = response;
    $.export("$summary", `Successfully retrieved ${length} phone book${length === 1
      ? ""
      : "s"}`);
    return response;
  },
};
