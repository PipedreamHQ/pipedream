import yayCom from "../../yay_com.app.mjs";

export default {
  key: "yay_com-get-documents",
  name: "Get Documents",
  description:
    "Retrieves all documents available. [See the documentation](https://www.yay.com/voip/api-docs/account/document/)",
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
    const response = await this.yayCom.listDocuments({
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
