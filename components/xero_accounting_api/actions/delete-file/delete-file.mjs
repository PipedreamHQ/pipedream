import xeroAccountingApi from "../../xero_accounting_api.app.mjs";

export default {
  key: "xero_accounting_api-delete-file",
  name: "Delete File",
  description: "Delete a file. [See the documentation](https://developer.xero.com/documentation/api/files/files#delete-files)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    xeroAccountingApi,
    fileId: {
      propDefinition: [
        xeroAccountingApi,
        "fileId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.xeroAccountingApi.deleteFile({
      $,
      fileId: this.fileId,
    });
    $.export("$summary", `Successfully deleted file with ID: ${this.fileId}`);
    return response;
  },
};
