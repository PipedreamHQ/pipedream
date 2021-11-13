const quickbooks = require("../../quickbooks.app");
const fs = require("fs");
const { promisify } = require("util");
const stream = require("stream");

module.exports = {
  name: "Download PDF",
  description: "Download an invoice, bill, purchase order, etc. as a PDF and save it in the temporary file system for use in a later step.",
  key: "quickbooks-download-pdf",
  version: "0.2.3",
  type: "action",
  props: {
    quickbooks,
    entity: {
      type: "string",
      label: "Document Type",
      description: null,
      options: [
        "CreditMemo",
        "Estimate",
        "Invoice",
        "Payment",
        "PurchaseOrder",
        "RefundReceipt",
        "SalesReceipt",
      ],
    },
    id: {
      type: "string",
      label: "Record ID",
      description: null,
    },
    fileName: {
      type: "string",
      label: "File Name (Optional)",
      description: "If no file name is provided, the PDF will be named using the record ID, e.g. '22743.pdf'",
      optional: true,
    },
  },
  methods: {
    async downloadPDF($, entity, id, fileName) {
      const file = await this.quickbooks.getPDF($, entity, id);

      const filePath = "/tmp/" + fileName;
      const pipeline = promisify(stream.pipeline);
      await pipeline(
        file,
        fs.createWriteStream(filePath),
      );
      return filePath;

      // const file = await require("@pipedreamhq/platform").axios($, {
      //   url: `https://quickbooks.api.intuit.com/v3/company/${this.quickbooks.$auth.company_id}/${entity.toLowerCase()}/${id}/pdf`,
      //   headers: {
      //     "Authorization": `Bearer ${this.quickbooks.$auth.oauth_access_token}`,
      //     "accept": "application/pdf",
      //   },
      //   responseType: "arraybuffer",
      // });

      // const filePath = "/tmp/" + fileName;
      // fs.writeFileSync(filePath, file);
      // return filePath;
    },
  },
  async run({ $ }) {
    const fileName = this.fileName || this.id;
    const fileNameWithExtension = fileName.endsWith(".pdf")
      ? fileName
      : fileName + ".pdf";

    const filePath = await this.downloadPDF($, this.entity, this.id, fileNameWithExtension);
    $.export("file_path", filePath);
    $.export("file_name", fileNameWithExtension);
  },
};
