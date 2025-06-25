import yay_com from "../../app/yay_com.app.mjs";

export default {
  key: "yay_com-get-phone-books",
  name: "Get Phone Books",
  description: "Retrieves a list of phone books. [See documentation](https://www.yay.com/voip/api-docs/phone-books/phone-book/)",
  version: "0.0.1",
  type: "action",
  props: {
    yay_com,
  },
  async run({ $ }) {
    const response = await this.yay_com.listPhoneBooks($);
    const phoneBooks = response.data || [];
    $.export("$summary", `Successfully retrieved ${phoneBooks.length} phone book(s)`);
    return response;
  },
};
