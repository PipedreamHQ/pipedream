import yay_com from "../../app/yay_com.app.mjs";

export default {
  key: "yay_com-get-documents",
  name: "Get Documents",
  description: "Retrieves a list of documents. [See documentation](https://www.yay.com/voip/api-docs/account/document/)",
  version: "0.0.1",
  type: "action",
  props: {
    yay_com,
  },
  async run({ $ }) {
    const response = await this.yay_com.listDocuments($);
    const documents = response.data || [];
    $.export("$summary", `Successfully retrieved ${documents.length} document(s)`);
    return response;
  },
};
