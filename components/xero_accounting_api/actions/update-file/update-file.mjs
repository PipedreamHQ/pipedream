import xeroAccountingApi from "../../xero_accounting_api.app.mjs";

export default {
  key: "xero_accounting_api-update-file",
  name: "Update File",
  description: "Rename a file or move it to a different folder. [See the documentation](https://developer.xero.com/documentation/api/files/files#put-files)",
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
    name: {
      type: "string",
      label: "Name",
      description: "The new name of the file",
      optional: true,
    },
    folderId: {
      propDefinition: [
        xeroAccountingApi,
        "folderId",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.xeroAccountingApi.updateFile(this.fileId, {
      $,
      data: {
        Name: this.name,
        FolderId: this.folderId,
      },
    });
    $.export("$summary", `Successfully updated file with ID: ${this.fileId}`);
    return response;
  },
};
