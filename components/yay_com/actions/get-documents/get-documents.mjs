import yay_com from "../../yay_com.app.mjs";

export default {
  key: "yay_com-get-documents",
  name: "Get Documents",
  description:
    "Retrieves a list of documents. [See documentation](https://www.yay.com/voip/api-docs/account/document/)",
  version: "0.0.1",
  type: "action",
  props: {
    yay_com,
  },
  async run({ $ }) {
    const response = await this.yay_com.listDocuments({
      $,
    });
    const { length } = response;
    $.export(
      "$summary",
      `Successfully retrieved ${length} document${length === 1
        ? ""
        : "s"}`,
    );
    return response;
  },
};
